
var num_inputs = 0;
var num_outputs = 0;
var input_signal_names = [];
var output_signal_names = [];
var signal_names = [];

function init() {

    // Initialize Input-Fields
    document.getElementById("input_vars").value = 4;
    document.getElementById("output_vars").value = 4;

    // Initialize Signal-Names
    variable_change();

}

function variable_change() {

    var inputs = parseInt(document.getElementById("input_vars").value,10);
    var outputs = parseInt(document.getElementById("output_vars").value,10);

    // Adjust Input and Output Signal-Arrays
    if ((num_inputs != inputs) | (num_outputs != outputs)) {

        while (num_inputs > inputs) {
            input_signal_names.pop();
            num_inputs --;
        }
        while (num_inputs < inputs) {
            input_signal_names[num_inputs] = "e_" + (num_inputs + 1);
            num_inputs ++;
        }
        while (num_outputs > outputs) {
            output_signal_names.pop();
            num_outputs --;
        }
        while (num_outputs < outputs) {
            output_signal_names[num_outputs] = "a_" + (num_outputs + 1);
            num_outputs ++;
        }

        signal_names = input_signal_names.concat(output_signal_names);

    }

    // Draw Table
    create_truth_table();

    // Update Equations
    update_equation();

}

function redraw_table() {

    console.log("Redrawing Table with " + num_inputs + " Inputs and " + num_outputs + " Outputs");

    create_truth_table();

}

function create_truth_table(){
    
    // Get Div in which the Table should be inserted
    var truth_table_div = document.getElementById("truth_table");

    // Remove old table (Child 0 is the h1-Header)
    truth_table_div.removeChild(truth_table_div.childNodes[1]);

    // Create New Table
    var table = document.createElement('table');
    table.class = "truth_table";

    // Create Header-Column
    var tr = table.insertRow();
    tr.class = "truth_table_tr";
    for(var j = 0; j < signal_names.length; j++){
        // Create Cell that contains an Input for the Signal-Name
        var td = tr.insertCell();
        td.class = "truth_table_td";
        td.appendChild(create_signal_input(j));
    }

    // Create Table-Body
    for(var i = 0; i < ((2 ** num_inputs) - 1); i++){
        // Create Column
        var tr = table.insertRow();
        tr.class = "truth_table_tr";
        for(var j = 0; j < signal_names.length; j++){
            // Create Cell that contains an Input for the Logic-Value
            var td = tr.insertCell();
            td.class = "truth_table_td";
            // TODO Put into Input
            td.onclick = function () {
                // Invert Logic-Value
                if(this.childNodes[0].value = "0") {
                    this.childNodes[0].value = "1";
                }else{
                    this.childNodes[0].value = "0";
                }
            };
            // Append Logic-Input to Cell
            td.appendChild(create_logic_input());
        }
    }

    // Insert new Table
    truth_table_div.appendChild(table);
}

function update_equation(cell_num, new_val) {

    // TODO

}

function create_signal_input(signal_num) {

    // Create New Input-Element
    var newInput = document.createElement("input");

    // Configure Input-Element
    newInput.type = "text";
    newInput.name = "Signal_Name";
    newInput.value = signal_names[signal_num];
    newInput.class = "name_input";
    // Create Callback-Function for OnChange
    newInput.onchange = (function (j_i) {
        return function () {
            change_signal_name(j_i,this.value);
        };
    }(signal_num));

    // Return Input-Element
    return newInput;

}

function create_logic_input(cell_num) {

    // Create New Input-Element
    var newInput = document.createElement("input");

    // Configure Input-Element
    newInput.type = "text";
    newInput.value = "0";
    newInput.class = "logic_input";
    // Disable Input so only Code can modify the Value
    newInput.disabled = true;
    // Create Callback-Function for OnClick
    // TODO Get from create_truth_table
    // FIXME: Input disabled ignores Onclick

    // Return Input-Element
    return newInput;

}

function change_signal_name(signal_num,signal_name) {
    signal_names[signal_num] = signal_name;
    if (signal_num < num_inputs) {
        input_signal_names[signal_num] = signal_name;
    }else if(signal_num < (num_inputs + num_outputs)) {
        output_signal_names[signal_num - num_inputs] = signal_name;
    }
}

// Execute Initialisation-Function when the Page is finished loading
document.addEventListener('DOMContentLoaded', init, false);
