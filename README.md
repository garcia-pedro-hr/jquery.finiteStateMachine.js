jQuery Finite State Machine Plugin
=========================

A very simple plugin for jQuery that deals with finite state machines inside HTML, with a mechanism that works like "steps".
It can make simple linear machines, that is, a mchine with incrementing steps as in 1 -> 2 -> 3 -> 4 ... or more complex machines with multiple paths.

![fsm example picture](http://www.oracle.com/ocom/groups/public/@otn/documents/digitalasset/144986.gif)

## Installation
Download [jQuery](http://jquery.com/download/) and include in your HTML file as:

```html
    <script type="application/javascript" src="path/to/jquery.file.js"></script>
```

Then download the [source file](js/jquery.finiteStateMachine.js) or the [minified version](js/jquery.finiteStateMachine.min.js) and include in your HTML file as:

```html
    <script type="application/javascript" src="js/jquery.form-machine.js"></script> <!-- If you downloaded the source file -->
    <script type="application/javascript" src="js/jquery.form-machine.min.js"></script> <!-- If you downloaded the minified version -->
```

## Usage
To become a Finite State Machine, a jQuery object must be initialized using:

```javascript
    $('.fsm').finiteStateMachine();
```

This initializes the object, thus the DOM element, and gives it the "machined" class.
If you wish to customize it further, you can override the default settings with the following options:

```javascript
    $('.fsm').finiteStateMachine({
            stateSelector: '.fsm-state',        // the class of the states
            nextSelector: '.fsm-next',          // the class of the objects that advance the state
            prevSelector: '.fsm-prev',          // the class of the objects that recede the state
            initialSelector: '.fsm-initial',    // the class of the initial state
            finalSelector: '.fsm-final',        // the class of the final (acceptance) states
            fadeSpeed: 300,                     // speed of fading of each state
            linear: false,                      // true -> linear machines, false -> complex machines
            before: null,                       // function that happens before the current state fades out and changes
            after: null,                        // function that happens after the current state changes and before it fades in again
            callback: null                      // function that happens after the current state changes and fades in again
    });
```

Then, in your HTML, you must define the initial and final states, as well as the in-between states.
This can be done by adding the state class (`.fsm-state` by default) to each state element and defining the `data-state` number.
If you are using a non-linear state machine, you also have to define the `data-evaluator`, which is the name of a javascript function that has the logic behind the machine.
Each state can have its own evaluator function.

```html
    <!-- Linear FSM -->
    <div id="sm">
        <div class="fsm-state fsm-initial" data-state="1">
            State 1 - Initial
        </div>

        <div class="fsm-state" data-state="2">
            State 2
        </div>

        <div class="fsm-state fsm-final" data-state="3">
            State 3 - Final
        </div>
    </div>
    
    <button type="button" class="fsm-prev">Prev</button>
    <button type="button" class="fsm-next">Next</button>
    
    <!-- Non-Linear FSM -->
     <div id="cm">
        <div class="fsm-state fsm-initial" data-state="1" data-evaluator="evaluatorFunc">
            State 1 - Initial
            <select class="form-control" id="select1">
                <option value="1">Path 1</option>
                <option value="2">Path 2</option>
            </select>
        </div>

        <div class="fsm-state" data-state="2" data-evaluator="evaluatorFunc">
            State 2
        </div>
        
        <div class="fsm-state" data-state="3" data-evaluator="evaluatorFunc">
            State 3
        </div>
        
        <div class="fsm-state" data-state="4" data-evaluator="evaluatorFunc">
            State 4
        </div>

        <div class="fsm-state fsm-final" data-state="5" data-evaluator="evaluatorFunc">
            State 5 - Final
        </div>
    </div>
    
    <button type="button" class="fsm-prev">Prev</button>
    <button type="button" class="fsm-next">Next</button>
    
    <script type="application/javascript">
        function evaluatorFunc () {
            switch ($('#cm').getCurrentState().data('state')) {
                case 1:
                    return 2;
                case 2:
                    if ($('#select1').val() == '1')
                        return 4;
                    else
                        return 3;
                case 3:
                    return 4;
                case 4:
                    return 5;
            }  
        };
    </script>
```

There also is a `$.getCurrentState()` utility function that returns the current state being shown.

```javascript
    $('.fsm').getCurrentState();
```

## Demonstration
You can find a working example of this plugin at http://garcia-pedro-hr.github.io/jquery.finiteStateMachine.js

## Contributing 
You can contribute to this project with issues or pull requests. 

## License 
This plugin is licensed under the [MIT License](LICENSE.md) (http://phgarcia.mit-license.org).

## Contact
If you want to share any ideas, feedback, requests or bug reports, you can reach me at garcia.ph@gmail.com or garcia-pedro-hr@gmail.com.
Please start the subject with a [FSM] tag so I can prioritize it.