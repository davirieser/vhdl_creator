
var num_inputs = 0;
var num_outputs = 0;
var input_signal_names = [];
var output_signal_names = [];
var signal_names = [];
var input_logic_vals = [];

var kv_diagram_size = {height:0,width:0,depth:0};

function init() {

    // Initialize Input-Fields
    document.getElementById("input_vars").value = 4;
    document.getElementById("output_vars").value = 1;

    //
    kv_diagram_size = {height:4,width:4,depth:1};

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
        td.classList.add("truth_table_header");
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
            td.appendChild(create_logic_input("0",true,("Ouput_"+j+"_logic_cell"+i)));
        }
    }

    // Insert new Table
    truth_table_div.appendChild(table);
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
    if (changable) {
        // Make Input readonly so only Code can modify the Value
        // OnChange still works with "readonly" contrary to "diasabled"
        newInput.readOnly = true;
        // Create Callback-Function for OnClick
        newInput.onclick = function () {
            // Invert Logic-Value
            if(this.value == "0") {
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

            input = document.getElementById("Ouput_"+i+"_logic_cell"+j);

            // Check that DOM-Element is valid
            if(input) {
                // Append Boolean Value to Array
                values.push(input.value);
                bool_values.push((input.value == "0") ? false : true);
            }

        }

        // string = output_signal_names[i] + " = " + values;

        heading = document.createElement("h2");
        text_node = document.createTextNode("Signal : \"" + output_signal_names[i] + "\"");
        heading.classList.add("kv_heading");
        heading.appendChild(text_node);
        kv_dia_div.appendChild(heading);

        // paragraph = document.createElement("p");
        // text_node = document.createTextNode(string);
        // paragraph.appendChild(text_node);
        // kv_dia_div.appendChild(paragraph);

        var kv_dia = create_kv_diagram(values,i);
        if (kv_dia){
            kv_dia_div.appendChild(kv_dia);
        }

        create_kv_packets(values,true);

        var equation = equation_from_packets(create_kv_packets(values,true));

        paragraph = document.createElement("p");
        text_node = document.createTextNode(output_signal_names[i] + " = " + equation);
        paragraph.appendChild(text_node);
        kv_dia_div.appendChild(paragraph);

    }

}

function create_kv_diagram(values,output_num) {

    if (values.length == (2 ** num_inputs)) {

        var middle_negated = [true,true,false,false];
        var right_negated = [true,false,false,true];

        var table = document.createElement("table");
        table.classList.add("kv_diagram");
        table.id = output_signal_names[output_num] + "_kv_diagram";

        // FIXME: Breaks if num_inputs != 4

        // Create Top-Input-Row
        var tr = table.insertRow();
        create_kv_inputs(tr,0,right_negated);

        for (i = 0; i < num_inputs; i ++) {

            // Create New Row in the Table
            var tr = table.insertRow();
            tr.classList.add("kv_diagram_tr");

            // Create Input-Name plus optional Negation
            create_kv_inputs_td(tr,input_signal_names[1],right_negated[i],"kv_diagram_td kv_diagram_name_td");

            for (j = 0; j < num_inputs; j ++) {
                var place = ((2**3) * right_negated[j]) + ((2**2) * right_negated[i]) + ((2**1) * middle_negated[j]) + ((2 **0) * middle_negated[i]);
                create_kv_inputs_td(tr,values[place],true,"kv_diagram_td kv_diagram_logic_td");
            }

            // Create Input-Name plus optional Negation
            create_kv_inputs_td(tr,input_signal_names[3],middle_negated[i],"kv_diagram_td kv_diagram_name_td");

        }

        // Create Bottom-Input-Row
        var tr = table.insertRow();
        create_kv_inputs(tr,2,middle_negated);

        return table;

    }else{
        console.log("Error creating KV-Diagram from given Values");
    }

}

function create_kv_packets(values, compare_val) {

    var i, j, k, l;
    var packets = [];
    var packets_old = [];
    var total_packets = [];

    for (i = 0; i < values.length; i++) {
        // Create Packet Array with single Packets
        // TODO Implement Don't Care
        if(values[i] == compare_val) {
            // TODO Des zum Array machen
            packets.push(i);
            total_packets.push([i]);
        }
    }

    console.log("Single Packets : " + packets);

    var packets_found = packets.length;

    while (packets_found > 1) {
        packets_found = 0;
        total_packets = total_packets.concat(packets_old);
        packets_old = packets;
        packets = [];
        // Cycle through all Values
        for (i = 0; i < packets_old.length; i++) {
            for (j = 0; j < num_inputs; j++){
                var test_cell = (packets_old[i]^(2**j));
                // Check if Packet could've already been checked to
                // avoid creating Packets multiple times
                if(packets_old[i] < test_cell){
                    // TODO Da muss a For-Schleife eini
                    // Check if adjacent Cell should also be put in a Packet
                    // Get adjacent Cells by flipping each Bit after another (XOR)
                    if(packets_old.includes(test_cell)) {
                        console.log("Packet [" + packets_old[i] + "," + test_cell + "] found");
                        // Mark a Packet
                        packets.push([packets_old[i],test_cell]);
                        total_packets.push([packets_old[i],test_cell]);
                        // packets_found++;
                    }
                }
            }
        }
    }

    // console.log("Cells : " + JSON.stringify(cells) + " \\and Packets : " + JSON.stringify(packets));

    // Create Packets of four from Packets of two

    // Remove unneccessary Packets

    console.log("All Packets : " + JSON.stringify(total_packets));
    packets_old = [];
    for (i = 0; i < values.length; i++) {
        // Create Packet Array with all needed Values
        if(values[i] == compare_val) {
            packets_old.push(i);
        }
    }
    packets = [];
    for (i = 0; i < total_packets.length; i++) {
        // Create Packet Array with recorded Values
        for(j = 0; j < total_packets[i].length; j ++){
            packets.push(total_packets[i][j]);
        }
    }

    j = 0;
    var temp;
    for(i = 0; i < total_packets.length; i++) {

        // TODO: Andersch kopieren?
        //       Mit Packets-Array Splicen und bei Else wieder einfuegen?
        temp = [...packets];
        temp.splice(j, total_packets[i].length);

        // Check if all Cells are still covered
        if(check_for_missing(temp, packets_old)) {

            // Remove unneccessary Packet
            console.log("Package : " + total_packets.splice(i,1) + " is unneccesary");
            i --;

            // Create new Reference Array
            packets = [];
            for (k = 0; k < total_packets.length; k++) {
                // Create Packet Array with recorded Values
                for(l = 0; l < total_packets[k].length; l ++){
                    packets.push(total_packets[k][l]);
                }
            }

        }else{
            j += total_packets[i].length;
        }

    }

    console.log("Needed Packets : " + JSON.stringify(total_packets));

    return total_packets;

}

// Check if array2 is contained in array1
function check_for_missing(array1,array2) {

    var i, j;
    var found = 0;

    for(j = 0; j < array2.length; j ++){
        for(i = 0; i < array1.length; i++) {
            if(array1[i] == array2[j]) {
                found ++;
                break;
            }
        }
    }

    return (found == array2.length);
}

function create_kv_inputs(tr,input_num,negated) {

    create_kv_inputs_td(tr,"",true,"kv_diagram_td");

    for(j = 0; j < 4; j++){

        create_kv_inputs_td(tr,input_signal_names[input_num],negated[j],"kv_diagram_td kv_diagram_name_td");

    }

    create_kv_inputs_td(tr,"",true,"kv_diagram_td");

}

function create_kv_inputs_td(tr,text,negated,classes) {

    var td = tr.insertCell();

    if(classes){
        classes.split(" ").forEach(class_string => {
            td.classList.add(class_string);
        });
    }

    var span = document.createElement("span");
    if (!negated) {
        span.classList.add("negated_logic");
    }
    var text_node = document.createTextNode(text);
    span.appendChild(text_node);
    td.appendChild(span);

}

function equation_from_packets(packets) {

    var i;
    var output_string = "";

    for (i = 0; i < packets.length; i++) {
        output_string += equation_from_packet(packets[i]) + " | ";
    }

    output_string = output_string.slice(0,-3);

    console.log(output_string);

    return output_string;

}

function equation_from_packet(packet) {

    if(!(packet.length == 0)) {

        var i, j;
        var negated_inputs = [];

        console.log("Packaging : " + packet[0]);

        // Create Array with Input-Names
        for(i = 0; i < num_inputs; i++) {
            negated_inputs.push({
                input_name: input_signal_names[i],
                negated: !(((packet[0] >> (num_inputs - i - 1)) & 1) == 1)
            });
        }

        // Cycle through all Packets
        for(i = 0; i < (packet.length-1); i++) {
            // Cycle through all Bits
            for (j = 0; j < num_inputs; j++) {
                // Check which Bit is different
                if ((packet[i] & (2 ** j)) != (packet[i+1] & (2 ** j))) {
                    // Remove Input if Bits differ
                    negated_inputs.splice((num_inputs - j - 1),1);
                }
            }
        }

        // Create String Output
        var string_output = "(";
        for(i = 0; i < negated_inputs.length; i++) {
            string_output += (negated_inputs[i].negated ? "not " : "") + negated_inputs[i].input_name + " & ";
        }

        // Remove "|"-Operator from the End of the String
        string_output = string_output.slice(0, -3);
        string_output += ')';

        console.log(packet + " => " + string_output);

        return string_output;

    }

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
