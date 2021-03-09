
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
    code_container.classList.add("form-control");
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
    // Make Entity and Testbench equally long => Overflows most of the time
    code_container.rows =  6 + num_inputs + num_outputs + 2 + 4 + num_outputs + 3;
    // code_container.rows = 26 + 4 * num_inputs + 3 * num_outputs;
    code_container.cols = 80;
    code_container.readOnly = true;
    code_container.classList.add("form-control");
    var text_node = document.createTextNode(libraries + entity + architecture);
    code_container.appendChild(text_node);

    return code_container;

}
