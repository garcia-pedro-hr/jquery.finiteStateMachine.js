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
            stateSelector: '.form-state',
            nextSelector: '.form-next',
            prevSelector: '.form-prev',
            initialSelector: '.form-initial',
            finalSelector: '.form-final',
            fadeSpeed: 300,
            multiple: false,
            before: null,
            callback: null
        }, options);

        var $form = this;
        var $states = $form.find(settings.stateSelector);
        var $next = $form.find(settings.nextSelector);
        var $prev = $form.find(settings.prevSelector);

        var stateData = $states.map(function () {
            return $(this).hide().data('state');
        }).get();
        
        var stateStack= []; // for complex machine behavior

        if (!settings.multiple) {
            // Simple machine behavior
            var start = Math.min.apply(Math, stateData);
            var end = Math.max.apply(Math, stateData)
            var curr_state = start;
            
            $form.getState(curr_state).show();
            $prev.prop('disabled', true);

            $next.click(function () {
                if (settings.before)
                    settings.before();

                $prev.prop('disabled', false);

                $form.getState(curr_state).fadeOut(settings.fadeSpeed, function () {
                    do {
                        curr_state++;
                    } while ($form.getState(curr_state).length == 0);

                    $form.getState(curr_state).fadeIn(settings.fadeSpeed);

                    if (curr_state == end)
                        $next.prop('disabled', true);

                    if (settings.callback)
                        settings.callback();
                });
            });

            $prev.click(function () {
                if (settings.before)
                    settings.before();

                $next.prop('disabled', false);

                $form.getState(curr_state).fadeOut(settings.fadeSpeed, function () {
                    do {
                        curr_state--;
                    } while ($form.getState(curr_state).length == 0);

                    $form.getState(curr_state).fadeIn(settings.fadeSpeed);

                    if (curr_state == start)
                        $prev.prop('disabled', true);

                    if (settings.callback)
                        settings.callback();
                });
            });
        } else {
            // Complex machine behavior
            var $curr_state = $form.find(settings.initialSelector);
            $curr_state.show();
            $prev.prop('disabled', true);

            $next.click(function () {
                if (settings.before)
                    settings.before();

                stateStack.push($curr_state);
                $prev.prop('disabled', false);

                $curr_state.fadeOut(settings.fadeSpeed, function () {
                    var next = window[$curr_state.data('evaluator')]();
                    console.log(next);
                    $curr_state = $form.getState(next);

                    $curr_state.fadeIn(settings.fadeSpeed);

                    if ($curr_state.hasClass(settings.finalSelector))
                        $next.prop('disabled', true);

                    if (settings.callback)
                        settings.callback();
                });
            });

            $prev.click(function () {
                if (settings.before)
                    settings.before();

                $next.prop('disabled', false);

                $curr_state.fadeOut(settings.fadeSpeed, function () {
                    var $next = stateStack.pop();
                    $curr_state = $next

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

    $.fn.getState = function (index) {
        return this.find('.form-state[data-state="' + index + '"]');
    }
    
    $.fn.getCurrentState = function () {
        console.log(this.find('.form-state:visible'));
    }

}(jQuery));
