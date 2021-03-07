
var num_inputs = 0;
var num_outputs = 0;
var input_signal_names = [];
var output_signal_names = [];
var signal_names = [];
var input_logic_vals = [];

var output_values = [];
var output_packets = [];

var highlight_packets = [];

// TODO Implement in KV-Diagram
var negated_kv_inputs = [
    [true,false,false,true],
    [true,false,false,true],
    [true,true,false,false],
    [true,true,false,false],
    [false,true,false,true],
    [false,false,true,true]
];

var kv_diagram_size = {height:0,width:0,depth:0};

function init() {

    // Initialize Input-Fields
    document.getElementById("input_vars").value = 4;
    document.getElementById("output_vars").value = 2;

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
            for(var i = 0; i < num_outputs; i ++){
                for(var j = (2**(num_inputs - 1)); j < (2**num_inputs); j++) {
                    output_values[i][j] = "0";
                }
            }
        }
        while (num_outputs > outputs) {
            output_signal_names.pop();
            num_outputs --;
            output_values.pop();
            highlight_packets.pop();
        }
        while (num_outputs < outputs) {
            output_signal_names[num_outputs] = "A_" + (num_outputs + 1);
            num_outputs ++;
            var x = [];
            for(var i = 0; i < (2 ** num_inputs); i ++){
                x[i] = "0";
            }
            output_values.push(x);
            output_packets.push([]);
            highlight_packets.push(-1);
        }

        signal_names = input_signal_names.concat(output_signal_names);

    }

    kv_diagram_size = {
        height: (num_inputs < 3 ? 2 : 4),
        width:  (num_inputs < 4 ? 2 : 4),
        depth:  (num_inputs < 5 ? 1 : (num_inputs < 6 ? 2 : 4)),
    };

    // Draw Table
    update_truth_table();

    // Update Equations
    update_equation();

    // Create VHDL-Code
    // update_vhdl_code();

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

/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- Truth Table Functions ----------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function update_truth_table() {

    // Get Div in which the Table should be inserted
    var truth_table_div = document.getElementById("truth_table_div");

    // Remove old table
    while (truth_table_div.hasChildNodes()) {
        truth_table_div.removeChild(truth_table_div.lastChild);
    }

    truth_table_div.append(create_truth_table());

}

function create_truth_table(){

    if(num_inputs < 8){

        var i, j;

        // Create New Table
        var container = document.createElement("div");
        add_classes(container, "divTableCell");
        var table = document.createElement('table');
        table.id = "truth_table";
        table.classList.add("truth_table");

        var header = document.createElement("h1");
        header.appendChild(document.createTextNode("Truth Table"));
        container.appendChild(header);

        // Create Header-Column
        var tr = table.insertRow();
        tr.classList.add("truth_table_tr");
        for(var j = input_signal_names.length; j > 0; j--){
            // Create Cell that contains an Input for the Signal-Name
            var td = tr.insertCell();
            add_classes(td,"truth_table_td truth_table_header");
            td.appendChild(create_signal_input(j-1));
        }
        // Seperate Inputs and Outputs in Table using Double Border
        td.classList.add("double_border");
        for(var j = input_signal_names.length; j < signal_names.length; j++){
            // Create Cell that contains an Input for the Signal-Name
            var td = tr.insertCell();
            add_classes(td,"truth_table_td truth_table_header");
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
                add_classes(td,"truth_table_td");
                // Create Binary Numbers in Signal-Inputs
                logic_val = ((((i&(2**(j-1)))==(2**(j-1))))?"1":"0");
                // Append Logic-Input to Cell
                td.appendChild(create_logic_input(logic_val,false,""));
            }
            for(j = 0; j < output_signal_names.length; j++){
                // Create Cell that contains an Input for the Logic-Value
                var td = tr.insertCell();
                // Seperate Inputs and Outputs in Table using Double Border
                add_classes(td,(j == 0 ? "truth_table_td double_border" : "truth_table_td"));
                // Append Logic-Input to Cell
                td.appendChild(create_logic_input(output_values[j][i],true,("Ouput_"+j+"_logic_cell"+i)));
            }
        }

        container.appendChild(table);

        // Return Table
        return container;

    }else{

        var error_string =  "Please refrain from using more than 7 Inputs - " +
                            "I don't want to fry your computer";

        paragraph = document.createElement("p");
        text_node = document.createTextNode(error_string);
        paragraph.appendChild(text_node);

        return paragraph;
    }
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
            variable_change();
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

/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- Update Functions ---------------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function update_equation() {

    var i, j;
    var values;
    var kv_table;
    var kv_div;
    var kv_container = document.getElementById("karnaugh_map_container");

    var equation = "";
    var heading;
    var text_node;
    var paragraph;

    var input;

    // Remove previously created Diagrams
    while (kv_container.hasChildNodes()) {
        kv_container.removeChild(kv_container.lastChild);
    }

    if((num_inputs >= 2) & (num_inputs <= 6)){

        for (i = 0; i < num_outputs; i++) {

            // Get Values from Truth-Table
            values = get_truth_table_values(i);

            output_values[i] = values;

            kv_div = document.createElement("div");
            add_classes(kv_div, "divTableCell");

            // Create Heading with Signal-Name
            heading = document.createElement("h2");
            text_node = document.createTextNode("Signal : \"" + output_signal_names[i] + "\"");
            heading.classList.add("kv_heading");
            heading.appendChild(text_node);
            kv_div.appendChild(heading);
            kv_div.appendChild(document.createElement("br"));

            packets = create_kv_packets(values,true);
            output_packets[i] = packets;

            // Create KV-Diagram
            kv_table = create_kv_diagram(values,i);
            // Check that KV-Diagram is valid
            // Could be invalid if (2 < Number of Inputs < 6) => see "create_kv_diagram()"
            if (kv_table){
                kv_div.appendChild(kv_table);
            }

            var packet_selectors = create_kv_packet_selectors(i);

            kv_div.appendChild(document.createElement("br"));
            kv_div.appendChild(packet_selectors);

            // Create Paragraph with Boolean Equation
            kv_div.appendChild(create_equations(i));
            kv_div.appendChild(document.createElement("br"));

            // Create Code-Box with Latex-Karnaugh-Map
            kv_div.appendChild(create_latex_karnaugh_diagram(values,packets));

            kv_container.appendChild(kv_div);

        }

        // Highlight previously selected Packets
        rehighlight_packets();

        // Remove old Latex Truth-Table
        if (document.getElementById("latex_truth_table")){
            document.getElementById("truth_table_div").removeChild(document.getElementById("latex_truth_table"));
        }
        // Create New Latex Truth-Table
        document.getElementById("truth_table_div").appendChild(create_latex_truth_table());

        // Update VHDL-Code
        update_vhdl_code();

    }else{

        var error_string = "Cannot generate KV-Diagrams smaller than 2 or bigger than 6";

        paragraph = document.createElement("p");
        text_node = document.createTextNode(error_string);
        paragraph.appendChild(text_node);

        kv_dia_div.appendChild(paragraph);


    }

}

function get_truth_table_values(num_output) {

    var values = [];

    // Loop over Truth Table
    for (j = 0; j < (2 ** num_inputs); j++) {

        input = document.getElementById("Ouput_"+num_output+"_logic_cell"+j);

        // Check that DOM-Element is valid
        if(input) {
            // Append Value to Array
            values.push(input.value);
        }

    }

    return values;

}

/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- KV-Diagram Functions -----------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function create_kv_diagram(values,output_num) {

    if (values.length == (2 ** num_inputs)) {

        var i, j, k;

        var middle_negated = [true,true,false,false];
        var right_negated = [true,false,false,true];

        var table = document.createElement("table");
        table.classList.add("kv_diagram");
        table.id = output_signal_names[output_num] + "_kv_diagram";

        // FIXME: Breaks if (num_inputs == 3) | (num_inputs > 4)

        // Create Top-Input-Row
        var tr = table.insertRow();
        create_kv_inputs(tr,0,negated_kv_inputs[0]);

        for (i = 0; i < kv_diagram_size.depth; i++) {

            for (j = 0; j < kv_diagram_size.height; j ++) {

                // Create New Row in the Table
                var tr = table.insertRow();
                tr.classList.add("kv_diagram_tr");

                // Create Input-Name plus optional Negation
                create_kv_inputs_td(tr,input_signal_names[1],negated_kv_inputs[1][j],"kv_diagram_td kv_diagram_name_td");

                for (k = 0; k < kv_diagram_size.width; k ++) {
                    var place = calculate_kv_cell_place(i,j,k);
                    create_kv_inputs_td(tr,values[place],true,"kv_diagram_td kv_diagram_logic_td",("kv_diagram_"+output_num+"_cell_"+place));
                }

                if(kv_diagram_size.width == 4){
                    // Create Input-Name plus optional Negation
                    create_kv_inputs_td(tr,input_signal_names[3],negated_kv_inputs[3][j],"kv_diagram_td kv_diagram_name_td");
                }

            }

        }

        if(kv_diagram_size.height == 4){
            // Create Bottom-Input-Row
            var tr = table.insertRow();
            create_kv_inputs(tr,2,negated_kv_inputs[2]);
        }

        return table;

    }else{
        console.log("Error creating KV-Diagram from given Values");
    }

}

function calculate_kv_cell_place(table_num, row, column) {

    // TODO Implement Table-Number

    var i;
    var place = 0;

    for (i = 0; i < num_inputs; i++) {
        // TODO Doesn't quite work
        place += negated_kv_inputs[i][(((i%2)==0)?column:row)] * (2 ** i);

    }

    return place;

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
            packets.push([i]);
        }
    }

    var packets_found = packets.length;

    while (packets_found > 1) {
        packets_found = 0;
        total_packets = total_packets.concat(packets);
        packets_old = packets;
        packets = [];
        // Cycle through all Values
        for (i = 0; i < packets_old.length; i++) {
            packet_loop:
            for (j = i+1; j < packets_old.length; j++){
                var difference = packets_old[j][0] - packets_old[i][0];
                // Check if only one Bit is flipped
                if (check_if_bit_flipped(packets_old[j][0],packets_old[i][0])) {
                    if(!check_for_duplicate(packets_old[j],packets_old[i])){
                        for (l = 0; l < packets_old[i].length; l++){
                            if((packets_old[j][l] - packets_old[i][l]) != difference) {
                                continue packet_loop;
                            }
                        }
                        packets.push(packets_old[i].concat(packets_old[j]));
                        packets_found ++;
                    }
                }
            }
        }
    }

    total_packets = total_packets.concat(packets);

    // Remove unneccessary Packets

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

        // Remove one Packet to check if it is neccessary
        temp = packets.splice(j, total_packets[i].length);

        // Check if all Cells are still covered
        if(check_for_missing(packets, packets_old)) {

            // Remove unneccessary Packet
            total_packets.splice(i,1)
            i --;

        }else{
            // Readd Packet because it is neccessary
            packets.splice(j,0,...temp);
            j += total_packets[i].length;
        }

    }

    console.log("Needed Packets : " + JSON.stringify(total_packets));

    return total_packets;

}

function create_equations(num_output) {

    var container = document.createElement("div");
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createTextNode(output_signal_names[num_output] + " = "));
    container.appendChild(span_equation_from_packets(num_output));
    container.appendChild(document.createElement("br"));

    return container;

}

function create_kv_packet_selectors(output_num) {

    var i;
    var selector;
    var label;
    var selectors = document.createElement("il");

    if(output_packets[output_num]){

        if(output_packets[output_num].length != 0) {

            for(i = 0; i < output_packets[output_num].length; i++) {

                selector = document.createElement("li");

                selector.appendChild(document.createTextNode("Packet " + i));

                selector.id = "kv_" + output_num + "_selector_" + i;
                add_classes(selector, "kv_radio_selector");
                selector.onclick = (function (output_num,j_i) {
                    return function () {
                        highlight_packet(output_num,j_i);
                    };
                }(output_num,i));

                selectors.appendChild(selector);

            }

            return selectors;

        }

    }

    return document.createTextNode("No Packets to be selected");

}

function highlight_packet(output_num, packet_num) {

    var i;
    var node, node_id;

    if((highlight_packets[output_num] < output_packets[output_num].length)) {

        if ((highlight_packets[output_num] != -1)){

            for(i = 0; i < output_packets[output_num][highlight_packets[output_num]].length; i++) {

                node_id = "kv_diagram_"+output_num+"_cell_"+output_packets[output_num][highlight_packets[output_num]][i]
                node = document.getElementById(node_id);

                if(node){
                    node.parentNode.classList.remove("kv_diagram_highlight");
                }
            }

        }

        for(i = 0; i < output_packets[output_num][packet_num].length; i++) {

            node_id = "kv_diagram_"+output_num+"_cell_"+output_packets[output_num][packet_num][i]
            node = document.getElementById(node_id);

            if(node){
                node.parentNode.classList.add("kv_diagram_highlight");
            }

            highlight_packets[output_num] = packet_num;
        }

    }

}

function rehighlight_packets(){

    var i;

    for (i = 0; i < num_outputs; i++) {
        if (highlight_packets[i] != -1) {
            highlight_packet(i, highlight_packets[i]);
        }
    }

}

function create_kv_inputs(tr,input_num,negated) {

    create_kv_inputs_td(tr,"",true,"kv_diagram_td");

    for(j = 0; j < kv_diagram_size.width; j++){
        create_kv_inputs_td(tr,input_signal_names[input_num],negated[j],"kv_diagram_td kv_diagram_name_td");
    }

    create_kv_inputs_td(tr,"",true,"kv_diagram_td");

}

function create_kv_inputs_td(tr,text,negated,classes,id) {

    var td = tr.insertCell();

    add_classes(td,classes);

    var span = document.createElement("span");
    if (!negated) {
        span.classList.add("negated_logic");
    }
    if(id) {
        span.id = id;
    }
    var text_node = document.createTextNode(text);
    span.appendChild(text_node);
    td.appendChild(span);

}

/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- Packet-Convertion-Functions ----------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function equation_from_packets(packets) {

    var i;
    var output_string = "";

    if(packets.length != 0) {

        for (i = 0; i < packets.length; i++) {
            output_string += equation_from_packet(packets[i]) + " or ";
        }

        output_string = output_string.slice(0,-4);

        return output_string;

    }

    return "0";

}

function equation_from_packet(packet) {

    if(!(packet.length == 0)) {

        var i, j, len;
        var negated_inputs = [];

        // Create Array with Input-Names
        for(i = 0; i < num_inputs; i++) {
            negated_inputs.push({
                input_name: input_signal_names[i],
                negated: !(((packet[0] >> (num_inputs - i - 1)) & 1) == 1)
            });
        }

        len = negated_inputs.length;

        // Cycle through all Packets
        for(i = 1; i < packet.length; i *= 2) {
            // Cycle through all Bits
            for (j = 0; j < num_inputs; j++) {
                // Check which Bit is different
                if ((packet[0] & (2 ** j)) != (packet[i] & (2 ** j))) {
                    // Remove Input if Bits differ
                    negated_inputs.splice(((len--) - j - 1),1);
                }
            }
        }

        if(negated_inputs.length != 0) {

            // Create String Output
            var string_output = "(";
            for(i = 0; i < negated_inputs.length; i++) {
                string_output +=    (negated_inputs[i].negated ? "(not " : "") +
                                    negated_inputs[i].input_name +
                                    (negated_inputs[i].negated ? ")" : "") +
                                    " and ";
            }

            // Remove " and "-Operator from the End of the String
            string_output = string_output.slice(0, -5);
            string_output += ')';

            return string_output;

        }

        return "1";

    }

}

function span_equation_from_packets(output_num) {

    var i;
    var output_string = "";

    if(packets.length != 0) {

        var container = document.createElement("span");

        for (i = 0; i < (packets.length - 1); i++) {
            container.appendChild(span_equation_from_packet(output_num, i));
            container.appendChild(document.createTextNode(" ∨ "));
            container.appendChild(document.createElement("br"));
        }
        container.appendChild(span_equation_from_packet(output_num, i));

        return container;

    }

    return document.createTextNode("0");

}

function span_equation_from_packet(output_num, packet_num) {

    var packet = output_packets[output_num][packet_num];

    if(!(packet.length == 0)) {

        var i, j, len;
        var negated_inputs = [];

        // Create Array with Input-Names
        for(i = 0; i < num_inputs; i++) {
            negated_inputs.push({
                input_name: input_signal_names[i],
                negated: !(((packet[0] >> (num_inputs - i - 1)) & 1) == 1)
            });
        }

        len = negated_inputs.length;

        // Cycle through all Packets
        for(i = 1; i < packet.length; i *= 2) {
            // Cycle through all Bits
            for (j = 0; j < num_inputs; j++) {
                // Check which Bit is different
                if ((packet[0] & (2 ** j)) != (packet[i] & (2 ** j))) {
                    // Remove Input if Bits differ
                    negated_inputs.splice(((len--) - j - 1),1);
                }
            }
        }

        var container = document.createElement("span");
        add_classes(container, "span_packet_selector");

        if(negated_inputs.length != 0) {

            container.appendChild(document.createTextNode("("));

            for(i = 0; i < negated_inputs.length; i++) {
                container.appendChild(create_span_selector(negated_inputs,i));
            }

            container.onclick = function() {
                highlight_packet(output_num,packet_num);
            };

            container.appendChild(document.createTextNode(")"));

            return container;

        }

        return document.createTextNode("1");

    }

}

function create_span_selector(negated_inputs,packet_num) {

    var container = document.createElement("span");
    var span = document.createElement("span")
    var text_node = document.createTextNode(negated_inputs[packet_num].input_name);
    if(negated_inputs[packet_num].negated){
        add_classes(span, "negated_logic");
    }
    span.appendChild(text_node);
    container.appendChild(span);
    if(packet_num < (negated_inputs.length - 1)){
        container.appendChild(document.createTextNode(" ∧ "));
    }
    return container;

}

/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- VHDL-Functions -----------------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function update_vhdl_code() {

    var i;

    var divs = ["vhdl_script_entity", "vhdl_script_testbench"];

    for (i = 0; i < divs.length; i ++) {
        div = document.getElementById(divs[i]);
        // Remove previously created Diagrams
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }
    }

    document.getElementById(divs[0]).appendChild(create_vhdl_entity());
    document.getElementById(divs[1]).appendChild(create_vhdl_testbench());

}

function create_vhdl_entity() {

    var i;

    var entity_name = document.getElementById("entityName").value;

    var libraries = "library ieee;\n\tuse ieee.std_logic_1164.all;\n\tuse ieee.numeric_std.all;\n\n";

    var entity = "entity " + entity_name + " is\n\tport(\n\t\t";
    for(i = 0; i < num_inputs; i++){
        entity += input_signal_names[i] + "\t: in std_logic;\n\t\t";
    }
    for(i = 0; i < (num_outputs - 1); i++){
        entity += output_signal_names[i] + "\t: out std_logic;\n\t\t";
    }
    entity += output_signal_names[i] + "\t: out std_logic\n\t);\nend " + entity_name + ";";

    var architecture = "\n\narchitecture structure of " + entity_name + " is\n\n";

    architecture += "\tbegin\n";

    for(i = 0; i < num_outputs; i++) {
        var equation = equation_from_packets(output_packets[i]);
        if(equation.length == 1) {equation = "'" + equation + "'";};
        architecture += "\n\t\t" + output_signal_names[i] + " <= " + equation + ";";
    }
    architecture += "\n\nend structure;";

    var code_container = document.createElement("textarea");
    code_container.rows = 6 + num_inputs + num_outputs + 2 + 4 + num_outputs + 3;
    code_container.cols = 60;
    code_container.readOnly = true;
    code_container.classList.add("code_area");
    var text_node = document.createTextNode(libraries + entity + architecture);
    code_container.appendChild(text_node);

    return code_container;

}

function create_vhdl_testbench() {

    var i;

    var entity_name = document.getElementById("entityName").value;

    var libraries = "library ieee;\n\tuse ieee.std_logic_1164.all;\n\tuse ieee.numeric_std.all;\n\n";
    libraries += "library work;\n\tuse work." + entity_name + ".all;\n\n";

    var entity = "entity tb_" + entity_name + " is\nend tb_" + entity_name + ";";

    var architecture = "\n\narchitecture behaviour of tb_" + entity_name + " is\n\n";

    for(i = 0; i < num_inputs; i++) {
        architecture += "\tsignal s_" + input_signal_names[i] + "\t: std_logic := '0';\n"
    }
    for(i = 0; i < num_outputs; i++) {
        architecture += "\tsignal s_" + output_signal_names[i] + "\t: std_logic := '0';\n"
    }

    var component = "\n\tcomponent " + entity_name + " is\n\t\tport(\n\t\t\t";
    for(i = 0; i < num_inputs; i++){
        component += input_signal_names[i] + "\t: in std_logic;\n\t\t\t";
    }
    for(i = 0; i < (num_outputs - 1); i++){
        component += output_signal_names[i] + "\t: out std_logic;\n\t\t\t";
    }
    component += output_signal_names[i] + "\t: out std_logic\n\t\t);\n\tend component " + entity_name + ";\n\n";

    architecture += component;

    architecture += "\tbegin\n\n\t\tuut : work." + entity_name + " port map(\n";

    for(i = 0; i < num_inputs; i++) {
        architecture += "\t\t\t" + input_signal_names[i] + " => s_" + input_signal_names[i] + ",\n";
    }
    for(i = 0; i < (num_outputs - 1); i++) {
        architecture += "\t\t\t" + output_signal_names[i] + " => s_" + output_signal_names[i] + ",\n";
    }
    architecture += "\t\t\t" + output_signal_names[i] + " => s_" + output_signal_names[i] + "\n\t\t);\n\n"

    for(var iLauf = 0 ; iLauf < num_inputs; iLauf ++){

        architecture += "\t\ts_"+input_signal_names[iLauf]+" <= '0','1' after "+(iLauf+1)+"00 ps,'0' after "+(iLauf+parseInt(num_inputs)+1)+"00 ps;\n"

    }

    architecture += "\n\nend behaviour;";

    var code_container = document.createElement("textarea");
    code_container.rows = 26 + 4 * num_inputs + 3 * num_outputs;
    code_container.cols = 80;
    code_container.readOnly = true;
    code_container.classList.add("code_area");
    var text_node = document.createTextNode(libraries + entity + architecture);
    code_container.appendChild(text_node);

    return code_container;

}


/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- Latex Functions ----------------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function create_latex_truth_table() {

    if(num_inputs > 0){

        var i, j;
        var latex_code;

        // Create Latex Tabular-Tag
        latex_code = "\\begin{tabular}[";
        for(i = 0; i < num_inputs; i++) {latex_code += "c|"}
        latex_code += "|"
        for(i = 0; i < (num_outputs - 1); i++) {latex_code += "c|"}
        latex_code += "c]\n\t";

        // Create Header
        for(i = 0; i < num_inputs; i++) {
            latex_code += input_signal_names[i] + "&";
        }
        // Seperate Inputs and Outputs
        latex_code += " ";
        for(i = 0; i < (num_outputs-1); i++) {
            latex_code += output_signal_names[i] + "&";
        }
        // Insert Latex-Newline
        latex_code += output_signal_names[i] + "\\\\\n";

        // Create Table Row by Row
        for(i = 0; i < (2**num_inputs); i++) {

            // Indent for nicer Code
            latex_code += "\t";

            // Create Input-Columns
            for(j = num_inputs; j > 0; j--) {
                latex_code += ((((i >> (j - 1)) & 1) == 1) ? "1" : "0") + "&";
            }

            // Seperate Inputs and Outputs
            latex_code += " ";

            // Check that there Output-Columns
            if(num_outputs > 0){
                // Create Output-Columns
                for(j = 0; j < (num_outputs-1); j++) {
                    latex_code += output_values[j][i] + "&";
                }
                latex_code += output_values[j][i];
            }

            // Insert Latex-Newline
            latex_code += "\\\\\n";

        }

        latex_code += "\\end{tabular}";

        var latex_container = document.createElement("div");
        add_classes(latex_container, "divTableCell");
        latex_container.id = "latex_truth_table";

        var header = document.createElement("h1");
        header.appendChild(document.createTextNode("Latex Truth Table"));
        latex_container.appendChild(header);

        var text_area = document.createElement("textarea");
        text_area.rows = 3 + (2 ** (num_inputs));
        text_area.cols = 30 + 2 * (num_inputs + num_outputs);
        text_area.readOnly = true;
        var text_node = document.createTextNode(latex_code);
        text_area.classList.add("code_area");
        text_area.appendChild(text_node);

        latex_container.append(text_area);

        return latex_container;

    }else{

        var error_paragraph = document.createElement("p");
        var text_node = document.createTextNode("Cannot create Latex-Truth-Table without Inputs");
        error_paragraph.appendChild(text_node);

        return error_paragraph;
    }

}

function create_latex_karnaugh_diagram(values, packets) {

    var latex_string =  "\\begin{karnaugh-map}[" + kv_diagram_size.height +
                        "][" + kv_diagram_size.width + "][" + kv_diagram_size.depth + "]\n\t" +
                        "\\manualterms{" + values + "}\n" +
                        create_implicant_string(packets) +
                        "\\end{karnaugh-map}";
    latex_code = document.createElement("textarea");
    latex_code.rows = 3 + packets.length;
    latex_code.cols = 30 + (2 ** (num_inputs + 1));
    latex_code.readOnly = true;
    var text_node = document.createTextNode(latex_string);
    latex_code.classList.add("code_area");
    latex_code.appendChild(text_node);

    return latex_code;

}

function create_implicant_string(packets, string) {
    var i;
    var string = "";
    for(i = 0; i < packets.length; i++) {
        // TODO Implement Implicantedge and ImplicantCorner
        if(packets[i].length == 1) {
            string += "\t\\implicant" + ("{" + packets[i][0] + "}").repeat(2)  + "\n";
        }else{
            string += "\t\\implicant{" + packets[i].join("}{") + "}\n";
        }
    }
    return string;
}

/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- Helper Functions ---------------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

function add_classes(node, classes) {

    if(classes){
        classes.split(" ").forEach(class_string => {
            node.classList.add(class_string);
        });
    }

}

function check_if_bit_flipped(number_one,number_two) {

    var i;
    var flipped = 0;

    for (i = 0; i < num_inputs; i++) {
        if ((number_one ^ (2**i)) == number_two) {
            flipped++;
        }
    }

    if(flipped == 1) {
        return true;
    }
    return false;

}

// Check if array2 is contained in array1
function check_for_missing(array1,array2) {

    var i, j;
    var found = 0;

    for(j = 0; j < array2.length; j ++){
        for(i = 0; i < array1.length; i++) {
            if(array1[i] == array2[j]) {
                found ++;
                // Break on the first Match
                break;
            }
        }
    }

    return (found == array2.length);
}

// Check if array1 and array2 have a duplicate Value
function check_for_duplicate(array1,array2) {

    var i, j;
    var found = 0;

    for(j = 0; j < array2.length; j ++){
        for(i = 0; i < array1.length; i++) {
            if(array1[i] == array2[j]) {
                return true;
            }
        }
    }

    return false;
}

// Execute Initialisation-Function when the Page is finished loading
document.addEventListener('DOMContentLoaded', init, false);
