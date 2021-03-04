
var num_inputs = 0;
var num_outputs = 0;
var input_signal_names = [];
var output_signal_names = [];
var signal_names = [];
var input_logic_vals = [];

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
            input_signal_names[num_inputs] = "E_" + (num_inputs + 1);
            num_inputs ++;
        }
        while (num_outputs > outputs) {
            output_signal_names.pop();
            num_outputs --;
        }
        while (num_outputs < outputs) {
            output_signal_names[num_outputs] = "A_" + (num_outputs + 1);
            num_outputs ++;
        }

        signal_names = input_signal_names.concat(output_signal_names);

    }

    // Draw Table
    create_truth_table();

    // Update Equations
    update_equation();

}

function create_truth_table(){

    var i, j;

    // Get Div in which the Table should be inserted
    var truth_table_div = document.getElementById("truth_table_div");

    // Remove old table
    while (truth_table_div.hasChildNodes()) {
        truth_table_div.removeChild(truth_table_div.lastChild);
    }

    // Create New Table
    var table = document.createElement('table');
    table.id = "truth_table";
    table.classList.add("truth_table");

    // Create Header-Column
    var tr = table.insertRow();
    tr.classList.add("truth_table_tr");
    for(var j = 0; j < signal_names.length; j++){
        // Create Cell that contains an Input for the Signal-Name
        var td = tr.insertCell();
        td.classList.add("truth_table_td");
        td.classList.add("border_bottom");
        // Seperate Inputs and Outputs in Table using Double Border
        if(j == num_inputs){td.classList.add("double_border")}
        td.appendChild(create_signal_input(j));
    }

    // Create Table-Body
    for(i = 0; i < (2 ** num_inputs); i++){
        // Create Column
        var tr = table.insertRow();
        tr.classList.add("truth_table_tr");
        for(j = input_signal_names.length; j > 0; j--){
            // Create Cell that contains an Input for the Logic-Value
            var td = tr.insertCell();
            td.classList.add("truth_table_td");
            // Create Binary Numbers in Signal-Inputs
            logic_val = ((((i&2**(j-1))==2**(j-1)))?"1":"0");
            // Append Logic-Input to Cell
            td.appendChild(create_logic_input(logic_val,false,""));
        }
        for(j = 0; j < output_signal_names.length; j++){
            // Create Cell that contains an Input for the Logic-Value
            var td = tr.insertCell();
            td.classList.add("truth_table_td");
            // Seperate Inputs and Outputs in Table using Double Border
            if(j == 0){td.classList.add("double_border")}
            // Append Logic-Input to Cell
            td.appendChild(create_logic_input("0",true,output_signal_names[j]+"_cell"+i));
        }
    }

    // Insert new Table
    truth_table_div.appendChild(table);
}

function update_equation() {

    // TODO
    // https://github.com/mnahm5/Karnaugh-Map-Solver/blob/master/scripts/Calculator.js
    // https://www.rosettacode.org/wiki/Truth_table#JavaScript
    // https://en.wikipedia.org/wiki/Karnaugh_map
    // https://github.com/obsfx/kmap-solver-lib/blob/main/src/index.ts
    // https://web.stanford.edu/class/cs103/tools/truth-table-tool/

    var i, j;
    var values;
    var bool_values;
    var kv_dia_div = document.getElementById("karnaugh_map_container");

    var equation = "";
    var heading;
    var text_node;
    var paragraph;

    var input;

    // Remove previously created Diagrams
    while (kv_dia_div.hasChildNodes()) {
        kv_dia_div.removeChild(kv_dia_div.lastChild);
    }

    for (i = 0; i < num_outputs; i++) {

        // Empty Array for Logic Values
        values = [];
        bool_values = [];

        // Loop over Truth Table
        for (j = 0; j < (2 ** num_inputs); j++) {

            input = document.getElementById(output_signal_names[i]+"_cell"+j);

            // Check that DOM-Element is valid
            if(input) {
                // Append Boolean Value to Array
                values.push(input.value);
                bool_values.push((input.value == "0") ? false : true);
            }

        }

        string = output_signal_names[i] + " = " + values;

        heading = document.createElement("h2");
        text_node = document.createTextNode(output_signal_names[i]);
        heading.appendChild(text_node);
        kv_dia_div.appendChild(heading);

        paragraph = document.createElement("p");
        text_node = document.createTextNode(string);
        paragraph.appendChild(text_node);
        kv_dia_div.appendChild(paragraph);

        kv_dia_div.appendChild(create_kv_diagram(values,i));

    }

}

function create_kv_diagram(values,output_num) {

    if (values.length == (2 ** num_inputs)) {

        var middle_negated = [true,true,false,false];
        var right_negated = [true,false,false,true];

        var table = document.createElement("table");
        table.cellspacing = 0;
        table.cellpadding = 0;
        table.classList.add("kv_diagram");
        table.id = output_signal_names[output_num] + "_kv_diagram";

        // Create Top-Input-Row
        var tr = table.insertRow();
        create_kv_inputs(tr,0,right_negated);

        for (i = 0; i < num_inputs; i ++) {

            // Create New Row in the Table
            var tr = table.insertRow();
            tr.classList.add("kv_diagram_tr");

            // TODO: Des andersch machen
            // Create Input-Name plus optional Negation
            var td = tr.insertCell();
            td.classList.add("kv_diagram_name_td");
            var span = document.createElement("span");
            var text_node = document.createTextNode(input_signal_names[1]);
            if (!right_negated[i]) {
                span.classList.add("negated_logic");
            }
            span.appendChild(text_node);
            td.appendChild(span);

            for (j = 0; j < num_inputs; j ++) {

                var td = tr.insertCell();
                td.classList.add("kv_diagram_logic_td");
                var span = document.createElement("span");
                var text_node = document.createTextNode(values[(i*4)+j]);
                span.appendChild(text_node);

                td.appendChild(span);

            }

            // TODO: Des andersch machen
            // Create Input-Name plus optional Negation
            var td = tr.insertCell();
            var span = document.createElement("span");
            td.classList.add("kv_diagram_name_td");
            var text_node = document.createTextNode(input_signal_names[3]);
            if (!middle_negated[i]) {
                span.classList.add("negated_logic");
            }
            span.appendChild(text_node);
            td.appendChild(span);

        }

        // Create Bottom-Input-Row
        var tr = table.insertRow();
        create_kv_inputs(tr,2,middle_negated);

        return table;

    }else{
        console.log("Error creating KV-Diagram from given Values");
    }

}

function create_kv_inputs(tr,input_num,negated) {

    var td = tr.insertCell();
    var span = document.createElement("span");
    var text_node = document.createTextNode("");
    span.appendChild(text_node);
    td.appendChild(span);

    for(j = 0; j < 4; j++){
        var td = tr.insertCell();
        td.classList.add("kv_diagram_name_td");
        var span = document.createElement("span");
        if (!negated[j]) {
            span.classList.add("negated_logic");
        }
        var text_node = document.createTextNode(input_signal_names[input_num]);
        span.appendChild(text_node);
        td.appendChild(span);
    }

    var td = tr.insertCell();
    var span = document.createElement("span");
    var text_node = document.createTextNode("");
    span.appendChild(text_node);
    td.appendChild(span);

}

function create_signal_input(signal_num) {

    // Create New Input-Element
    var newInput = document.createElement("input");

    // Configure Input-Element
    newInput.type = "text";
    newInput.name = "Signal_Name";
    newInput.value = signal_names[signal_num];
    newInput.classList.add("name_input");
    // Create Callback-Function for OnChange
    newInput.onchange = (function (j_i) {
        return function () {
            change_signal_name(j_i,this.value);
        };
    }(signal_num));

    // Return Input-Element
    return newInput;

}

function create_logic_input(val,changable,cell_id) {

    // Create New Input-Element
    var newInput = document.createElement("input");

    // Configure Input-Element
    newInput.type = "text";
    newInput.value = val;
    newInput.classList.add("logic_input");
    //
    if (changable) {
        // Make Input readonly so only Code can modify the Value
        // OnChange still works with "readonly" contrary to "diasabled"
        newInput.readOnly = true;
        // Create Callback-Function for OnClick
        newInput.onclick = function () {
            // Invert Logic-Value
            if(this.value = "0") {
                this.value = "1";
            }else{
                this.value = "0";
            }
            // Generate new Equations
            update_equation();
        };
    }else{
        // Disable Input so only Code can modify the Value
        newInput.disabled = true;
    }
    if(cell_id) {
        // Give Input a ID so it can be easily accessed later
        newInput.id = cell_id;
    }

    // Return Input-Element
    return newInput;

}

function change_signal_name(signal_num,signal_name) {
    // Check that Signal_Number is valid (In the range of the Signal-Names-Array)
    if ((signal_num >= 0) && (signal_num < (num_inputs + num_outputs))) {
        // Change Signal-Name using the Signal-Number
        signal_names[signal_num] = signal_name;
        if (signal_num < num_inputs) {
            input_signal_names[signal_num] = signal_name;
        }else {
            output_signal_names[signal_num - num_inputs] = signal_name;
        }
    }else{
        console.log("Error renaming Signal Number " + signal_num + " : Out of Bounds");
    }
}

// Execute Initialisation-Function when the Page is finished loading
document.addEventListener('DOMContentLoaded', init, false);
