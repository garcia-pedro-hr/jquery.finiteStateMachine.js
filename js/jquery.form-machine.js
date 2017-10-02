/*
	Form Machine Plugin for jQuery (by Pedro Garcia)
	Version: 0.1
	http://phgarcia.com
	This plugin is offered under the MIT license.
	Copyright (c) 2017 Pedro Henrique Romaoli Garcia, http://phgarcia.mit-license.org
*/

(function ($) {

    $.fn.formMachine = function (options) {
        var settings = $.extend({
            stateSelector   : '.form-state',
            nextSelector    : '.form-next',
            prevSelector    : '.form-prev',
            initialSelector : '.form-init',
            finalSelector   : '.form-final',
            fadeSpeed       : 300,
            multiple        : false,
            before          : null,
            callback        : null
        }, options);
        
        var $form   = this;
        var $states = $(settings.stateSelector);
        var $next   = $(settings.nextSelector);
        var $prev   = $(settings.prevSelector);
        
        var stateData = $(settings.stateSelector).map(function() {
                return $(this).css('display', 'none').data('state-index');
            }).get();
        
        if (!settings.multiple) {
            // Simple machine behavior
            var start = Math.min.apply(Math, stateData);
            var end   = Math.max.apply(Math, stateData)
            var curr_state = start;

            getState(curr_state).removeAttr('style');
            $prev.prop('disabled', true);
                        
            $next.click(function() {
                if (settings.before) 
                    settings.before();
                
                $prev.prop('disabled', false);
                
                getState(curr_state).fadeOut(settings.fadeSpeed, function() {
                    do {
                        curr_state++
                    } while (getState(curr_state).length == 0);
                    
                    getState(curr_state).fadeIn(settings.fadeSpeed);
                    
                    if (curr_state == end)
                        $next.prop('disabled', true);
                    
                    if (settings.callback) 
                        settings.callback();
                });
            });
            
            $prev.click(function() {
                if (settings.before) 
                    settings.before();
                
                $next.prop('disabled', false);
                
                getState(curr_state).fadeOut(settings.fadeSpeed, function() {
                    do {
                        curr_state--
                    } while (getState(curr_state).length == 0);
                    
                    getState(curr_state).fadeIn(settings.fadeSpeed);
                    
                    if (curr_state == start)
                        $prev.prop('disabled', true);
                    
                    if (settings.callback) 
                        settings.callback(); 
                });
            });
        } else {
            // Complex machine behavior
            var $curr_state = $(settings.initialSelector);
            $curr_state.removeAttr('style');
            $prev.prop('disabled', true);
            
            $next.click(function() {
                if (settings.before)
                    settings.before();
                
                $prev.prop('disabled', false);
                
                $curr_state.fadeOut(settings.fadeSpeed, function() {
                    var next = window[$curr_state.data('evaluator')]();
                    $curr_state = getState(next);
                    
                    $curr_state.fadeIn(settings.fadeSpeed);
                    
                    if ($curr_state.hasClass(settings.finalSelector))
                        $next.prop('disabled', true);

                    if (settings.callback)
                        settings.callback(); 
                });
            });
            
            $prev.click(function() {
                if (settings.before)
                    settings.before();
                
                $next.prop('disabled', false);
                
                $curr_state.fadeOut(settings.fadeSpeed, function() {
                    var next = window[$curr_state.data('evaluator')]();
                    $curr_state = getState(next);
                    
                    $curr_state.fadeIn(settings.fadeSpeed);
                    
                    if ($curr_state.hasClass(settings.initialSelector))
                        $prev.prop('disabled', true);
                    
                    if (settings.callback)
                        settings.callback();
                });
            });
        }
        
        $form.addClass('machined');
    };
    
    function getState(index) {
        return $('div').find('[data-state="' + index + '"]');
    }
    
} (jQuery));