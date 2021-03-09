
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
        var header2 = document.createElement("h2");
        header2.appendChild(document.createTextNode("Hidden Filler Text for Height"));
        header2.style.visibility = "hidden";
        latex_container.appendChild(header);
        latex_container.appendChild(header2);

        var text_area = document.createElement("textarea");
        text_area.rows = 3 + (2 ** (num_inputs));
        text_area.cols = 30 + 2 * (num_inputs + num_outputs);
        text_area.readOnly = true;
        text_area.style = "font-size: 1.2rem;line-height: 2.6rem;"
        var text_node = document.createTextNode(latex_code);
        text_area.classList.add("form-control");
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
    latex_code.classList.add("form-control");
    latex_code.appendChild(text_node);

    return latex_code;

}

function create_implicant_string(packets, string) {
    var i, j, k;
    var string = "";

    for(i = 0; i < packets.length; i++) {
        // TODO Implement Implicantedge and ImplicantCorner
        if(packets[i].length == 1) {
            string += "\t\\implicant" + ("{" + packets[i][0] + "}").repeat(2)  + "\n";
        }else{
            string += "\t\\implicant{" + oder_packet(packets[i]).join("}{") + "}\n";
        }
    }
    return string;
}

function oder_packet(packet) {

    var i, j;
    var cell1, cell2;
    // Create new Packet which has the right Order
    var packets_ordered = [];

    cell_loop:
    for (i = 0; i < packet.length; i++) {
        cell1 = calculate_kv_cell_from_place(packets_ordered[i]);
        console.log("Packet : " + packet[i] + " = " + JSON.stringify(cell1));
        for(j = 0; j < packet.length; j ++) {
            cell2 = calculate_kv_cell_from_place(packet[j]);
            console.log("Checking against Packet " + packet[j] + " = " + JSON.stringify(cell2));
            if( (cell1.row < cell2.row) &
                (cell1.column > cell2.column) &
                (cell1.table_num < cell2.table_num)) {
                    console.log("Packet smaller");
                    packets_ordered.push(packet[j]);
                    // packets_ordered.slice(j,0,packet[j]);
                    continue cell_loop;
            }
        }
    }

    console.log("Ordered Packet : ", packets_ordered);

    return packets_ordered;

}
