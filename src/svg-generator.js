
/*
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- SVG-Functions ------------------------------------------------------------
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
*/

/* Counter Variables for ID's ----------------------------------------------- */
var num_paths = 0;
var num_gates = 0;
var num_negations = 0;
var num_ellipses = 0;
var num_texts = 0;

/* Size Variables for SVG-Size ---------------------------------------------- */
var current_height = 0;
var current_width = 0;

/* Dynamic Variables for SVG-Scaling ---------------------------------------- */
var distance = 5;
var edge_distance = 15;

var input_line_seperation = 10 * distance;
var input_negation_distance = 3 * distance;
var input_line_negation_size = distance;

var horizontal_input_distance = 2 * distance;
var horizontal_gate_distance = distance;
var vertical_gate_distance = 5 * distance;
var vertical_input_negation_distance = 2 * distance;
var horizontal_output_seperation = 3 * distance;

var negation_radius = distance/2;

/* Counter Variables for Gate-Scaling --------------------------------------- */
var gate_base_heigth = 20;
var gate_height_per_input = 10;
var gate_width = 60;
var gate_input_length = distance * 2;

/* Global Variables --------------------------------------------------------- */
var negation_pos = "Input Lines";
var gate_outputs = [];

/* Constants ---------------------------------------------------------------- */
var and_operator = "&";
var or_operator = "≥1";

var svg_darkmode = false;

function create_svg() {

    var i, j;
    var curr_gate = 0;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    current_height = 0;
    current_width = 0;
    gate_outputs = [];

    num_paths = 0;
    num_gates = 0;
    num_negations = 0;
    num_ellipses = 0;
    num_texts = 0;

    if(document.getElementById('svg_circuit')){
        document.getElementById("svg_container").removeChild(document.getElementById('svg_circuit'));
    }

    svg.setAttribute('id', 'svg_circuit');
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    if(svg_darkmode) {
        svg.setAttribute('style', 'background-color: rgb(55, 55, 55);border: 0.3ex solid #e6e6e6; border-radius:0.5em;');
    }else{
        svg.setAttribute('style', 'background-color: rgb(250, 250, 250);border: 0.3ex solid #161616; border-radius:0.5em;');
    }

    svg.appendChild(create_input_lines());

    for (i = 0; i < output_packets.length; i ++) {
        if(output_packets[i] && (output_packets[i].length > 0)) {
            for (j = 0; j < output_packets[i].length; j++) {
                svg.appendChild(draw_packet(output_packets[i][j], true));
                curr_gate++;
            }
            current_height += horizontal_output_seperation;
            svg.appendChild(connect_packet_outputs((curr_gate - j),((j!=0)?j:1)));
            var text_node = create_text(output_signal_names[i], gate_outputs[curr_gate].x_pos + distance, gate_outputs[curr_gate].y_pos);
            text_node.setAttribute('text-anchor', 'start');
            svg.appendChild(text_node);
            curr_gate++;
        }
    }

    svg.appendChild(extend_input_lines(current_height));

    document.getElementById("svg_container").appendChild(svg);

    current_width += get_longest_output_name();

    svg.setAttribute('viewBox', '0 0 ' + (current_width + edge_distance) + ' ' + (current_height + edge_distance));

}

function draw_packet(packet, connect_inputs) {

    var i;
    var negated = negated_from_packet(packet);

    var gate_x_pos = edge_distance + vertical_gate_distance + ((num_inputs - 1) * input_line_seperation);
    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var gate_heigth = current_height + gate_base_heigth/2;

    gate_container.appendChild(create_gate(gate_x_pos, current_height, and_operator, negated));
    gate_container.appendChild(connect_gate_inputs(gate_x_pos, gate_heigth, negated));

    current_height += (negated.length * gate_height_per_input) + horizontal_gate_distance +  gate_base_heigth;

    return gate_container;

}

function create_gate(x_pos, y_pos, symbol, inputs) {

    if(inputs.length > 1) {
        return create_operator_gate(x_pos, y_pos, symbol, inputs);
    }else if (inputs.length == 1) {
        if(inputs[0].negated) {
            return create_negation_gate(x_pos, y_pos, "1", true);
        }else{
            gate_outputs.push({
                    x_pos: x_pos + 2 * gate_input_length + gate_width,
                    y_pos: y_pos + (gate_height_per_input/2) + (gate_base_heigth/2)
            });
            return create_line(
                x_pos,
                y_pos + gate_height_per_input/2 + gate_base_heigth/2,
                x_pos + 2 * gate_input_length + gate_width,
                y_pos + gate_height_per_input/2 + gate_base_heigth/2
            );
        }
    }

    return create_constant(x_pos, y_pos,"1");

}

function get_longest_output_name() {

    var i, length;
    var longest = 0;
    var node;

    for (i = num_inputs; i < num_texts; i++){

        node = document.getElementById("svg_text_node_" + i);

        if(node) {
            length = node.getComputedTextLength();
            if(length > longest) {
                longest = length;
            }
        }

    }

    return longest;

}

// Assumes that the Input has at least 2 Elements
function create_operator_gate(x_pos, y_pos, symbol, inputs) {

    var i;

    var top_left        = {
        x_pos: x_pos + gate_input_length,
        y_pos: y_pos
    };
    var middle_middle   = {
        x_pos: x_pos + (gate_width/2),
        y_pos: y_pos + gate_height_per_input * (inputs.length/2) + gate_base_heigth/2
    }
    var bottom_right    = {
        x_pos: x_pos + gate_width,
        y_pos: y_pos + gate_height_per_input * inputs.length +  gate_base_heigth
    };

    var gate_connectors_path = '';

    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var gate_outline = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var gate_connectors = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    // Create Operator-Text
    gate_container.appendChild(create_text(symbol, middle_middle.x_pos, middle_middle.y_pos));

    // Create Input Connectors
    for (i = 0.5; i < inputs.length; i ++) {
        gate_connectors_path += 'M ' + x_pos + ' ' + (top_left.y_pos + (gate_base_heigth/2) + (gate_height_per_input * i)) + ' ';
        if((negation_pos == "Gates")) {
            if(!(inputs[(i - 0.5)].negated)){
                gate_connectors_path += 'L ' + top_left.x_pos + ' ' + (top_left.y_pos + gate_base_heigth/2 + (gate_height_per_input * i)) + ' ';
            }else{
                gate_connectors_path += 'L ' + (top_left.x_pos - negation_radius) + ' ' + (top_left.y_pos + gate_base_heigth/2 + (gate_height_per_input * i)) + ' ';
                gate_container.appendChild(create_negation((top_left.x_pos - negation_radius), (top_left.y_pos + gate_base_heigth/2 + (gate_height_per_input * i))));
            }
        }else{
            gate_connectors_path += 'L ' + top_left.x_pos + ' ' + (top_left.y_pos + gate_base_heigth/2 + (gate_height_per_input * i)) + ' ';
        }
    }

    // Create Output Connector
    gate_connectors_path +=
        'M ' + bottom_right.x_pos + ' ' + middle_middle.y_pos + ' ' +
        'L ' + (bottom_right.x_pos + gate_input_length) + ' ' + middle_middle.y_pos;

    gate_connectors.setAttribute('d', gate_connectors_path);
    set_path_properties(gate_connectors);

    gate_outline.setAttribute('d',
    // Upper Edge
        'M ' + top_left.x_pos + ' ' + top_left.y_pos + ' ' +
        'L ' + middle_middle.x_pos + ' ' + top_left.y_pos + ' ' +
    // Curve to Output
        'C ' +  middle_middle.x_pos + ' ' + top_left.y_pos + ' ' +
                bottom_right.x_pos + ' ' + top_left.y_pos + ' ' +
                bottom_right.x_pos + ' ' + middle_middle.y_pos + ' ' +
    // Curve from Output to Bottom Edge
        'C ' +  bottom_right.x_pos + ' ' + middle_middle.y_pos + ' ' +
                bottom_right.x_pos + ' ' + bottom_right.y_pos + ' ' +
                middle_middle.x_pos + ' ' + bottom_right.y_pos + ' ' +
    // Bottom Edge
        'L ' + top_left.x_pos + ' ' + bottom_right.y_pos + ' ' +
    // Left Edge
        'Z'
    );
    set_path_properties(gate_outline);

    gate_container.appendChild(gate_connectors);
    gate_container.appendChild(gate_outline);

    gate_outputs.push(
        {
            x_pos: (bottom_right.x_pos + gate_input_length),
            y_pos: middle_middle.y_pos
        }
    );

    if(current_width < (bottom_right.x_pos + gate_input_length)){
        current_width = (bottom_right.x_pos + gate_input_length);
    }

    return gate_container;

}

function create_negation_gate(x_pos, y_pos, symbol, negated) {

    var i;

    var top_left        = {
        x_pos: x_pos + gate_input_length,
        y_pos: y_pos
    };
    var middle_middle   = {
        x_pos: x_pos + (gate_width/2),
        y_pos: y_pos + (gate_height_per_input/2) + gate_base_heigth/2
    };
    var bottom_right    = {
        x_pos: x_pos + gate_width,
        y_pos: y_pos + gate_height_per_input + gate_base_heigth
    };

    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var gate_outline = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    // Create Input Connector
    gate_container.appendChild(create_line(x_pos, middle_middle.y_pos, top_left.x_pos, middle_middle.y_pos));

    if(negation_pos == "Gates") {

        // Create Operator-Text
        gate_container.appendChild(create_text(symbol, middle_middle.x_pos, middle_middle.y_pos));

        // Create Output Connector and Negation if needed
        if(negated) {
            gate_container.appendChild(create_line(bottom_right.x_pos + negation_radius, middle_middle.y_pos, bottom_right.x_pos + gate_input_length, middle_middle.y_pos));
            gate_container.appendChild(create_negation(bottom_right.x_pos, middle_middle.y_pos, negation_radius));
        }else{
            gate_container.appendChild(create_line(bottom_right.x_pos, middle_middle.y_pos, bottom_right.x_pos + gate_input_length, middle_middle.y_pos));
        }

        // Create Negation-Box
        gate_outline.setAttribute('d',
            'M ' + top_left.x_pos + ' ' + top_left.y_pos + ' ' +
        // Top Edge
            'L ' + bottom_right.x_pos + ' ' + top_left.y_pos + ' ' +
        // Right Edge
            'L ' + bottom_right.x_pos + ' ' + bottom_right.y_pos + ' ' +
        // Bottom Edge
            'L ' + top_left.x_pos + ' ' + bottom_right.y_pos + ' ' +
        // Left Edge
            'Z'
        );
    }else {
        gate_container.appendChild(create_line(top_left.x_pos, middle_middle.y_pos, bottom_right.x_pos + gate_input_length, middle_middle.y_pos));
    }

    set_path_properties(gate_outline);

    // gate_container.appendChild(gate_connectors);
    gate_container.appendChild(gate_outline);

    gate_outputs.push(
        {
            x_pos: x_pos + gate_width + gate_input_length,
            y_pos: y_pos + (gate_height_per_input/2) + gate_base_heigth/2
        }
    );

    if(current_width < (x_pos + gate_width + gate_input_length)){
        current_width = (x_pos + gate_width + gate_input_length);
    }

    return gate_container;

}

function create_constant(x_pos, y_pos, constant_val) {

    var constant_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var constant_outline = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var constant_connectors = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    var top_left        = {
        x_pos: x_pos + gate_input_length,
        y_pos: y_pos
    };
    var middle_middle   = {
        x_pos: x_pos + (gate_width/2),
        y_pos: y_pos + (gate_height_per_input/2) + gate_base_heigth/2
    };
    var bottom_right    = {
        x_pos: x_pos + gate_width,
        y_pos: y_pos + gate_height_per_input + gate_base_heigth
    };

    // Create Operator-Text
    constant_container.appendChild(create_text(constant_val, middle_middle.x_pos, middle_middle.y_pos));

    // Create Output Connectors
    var input_lines =
        ' M ' + bottom_right.x_pos + ' ' + middle_middle.y_pos +
        ' L ' + (bottom_right.x_pos + gate_input_length) + ' ' + middle_middle.y_pos;

    constant_outline.setAttribute('d',
    // Start Positiion
        'M '  + top_left.x_pos + ' ' + top_left.y_pos +
    // Upper Edge
        ' L ' + bottom_right.x_pos + ' ' + top_left.y_pos +
    // Right Edge
        ' L ' + bottom_right.x_pos + ' ' + bottom_right.y_pos +
    // Bottom Edge
        ' L ' + top_left.x_pos + ' ' + bottom_right.y_pos +
    // Left Edge
        ' Z'
    );
    set_path_properties(constant_outline);

    gate_outputs.push(
        {
            x_pos: (bottom_right.x_pos + gate_input_length),
            y_pos: middle_middle.y_pos
        }
    );

    constant_connectors.setAttribute('d', input_lines);
    set_path_properties(constant_connectors);

    constant_container.appendChild(constant_connectors);
    constant_container.appendChild(constant_outline);

    if(current_width < (x_pos + gate_width + gate_input_length)){
        current_width = (x_pos + gate_width + gate_input_length);
    }

    return constant_container;

}

function connect_gate_inputs(x_pos, y_pos, negated) {

    var i;
    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < negated.length; i ++){
        gate_container.appendChild(connect_gate_input(x_pos, (y_pos + (gate_height_per_input * (i + (1/2)))), negated[i].input_name, negated[i].negated));
    }

    return gate_container;

}

function connect_packet_outputs(gate_start_index, num_gates) {

    var i;
    var break_distance = 0;
    var median_heigth = 0;
    var negated = [];

    var connection;
    var container = document.createElementNS("http://www.w3.org/2000/svg", "g");

    if(num_gates > 1) {

        for (i = 0; i < num_gates; i ++) {
            median_heigth += gate_outputs[gate_start_index + i].y_pos;
            negated.push({input_name: "Moin",negated: false});
        }

        // Center Gate
        if ((num_gates % 2) != 0) {
            median_heigth = gate_outputs[gate_start_index + ((num_gates - 1)/2)].y_pos - (((((num_gates-1)/2) + (1/2) - num_gates) * gate_height_per_input) + gate_base_heigth/2);
        }else{
            median_heigth /= num_gates;
        }

        for(i = 0; i < num_gates; i ++) {

            break_index = (((i<(num_gates/2))&&((num_gates%2)==0))?i+1:i);

            // Ensure Lines don't overlap
            break_distance = vertical_gate_distance * ((Math.abs(Math.floor(num_gates/2) - break_index) / (num_gates/2)));

            connection = document.createElementNS("http://www.w3.org/2000/svg", "path");

            connection.setAttribute('d',
                'M ' + (gate_outputs[gate_start_index + i].x_pos) + ' ' + gate_outputs[gate_start_index + i].y_pos + ' ' +
                'L ' + (gate_outputs[gate_start_index + i].x_pos + break_distance) + ' ' + gate_outputs[gate_start_index + i].y_pos + ' ' +
                'L ' + (gate_outputs[gate_start_index + i].x_pos + break_distance) + ' ' + (median_heigth + ((i + (1/2) - num_gates) * gate_height_per_input) + gate_base_heigth/2) + ' ' +
                'L ' + (gate_outputs[gate_start_index + i].x_pos + vertical_gate_distance) + ' ' + (median_heigth + (i + (1/2) - num_gates) * gate_height_per_input + gate_base_heigth/2)
            );
            set_path_properties(connection);

            container.appendChild(connection);

        }

        container.appendChild(create_gate((gate_outputs[0].x_pos + vertical_gate_distance), (median_heigth - (gate_height_per_input * num_gates)), or_operator, negated));

    }else{

        container.appendChild(create_line(
            gate_outputs[gate_start_index].x_pos,
            gate_outputs[gate_start_index].y_pos,
            gate_outputs[gate_start_index].x_pos + 2 * vertical_gate_distance,
            gate_outputs[gate_start_index].y_pos
        ));

        gate_outputs.push({
            x_pos: gate_outputs[gate_start_index].x_pos + 2 * vertical_gate_distance,
            y_pos: gate_outputs[gate_start_index].y_pos
        });

    }

    return container;

}

function connect_gate_input(x_pos, y_pos, input, negated) {

    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    var gate_connection = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    var x_pos_input = edge_distance + (input_line_seperation * input) + (horizontal_input_distance * ((negation_pos != "Gates") * negated));

    gate_connection.setAttribute('d','M ' + x_pos_input + ' ' + y_pos + ' L ' + x_pos + ' ' + y_pos);
    set_path_properties(gate_connection);

    gate_container.appendChild(gate_connection);
    gate_container.appendChild(create_connection(x_pos_input, y_pos, negation_radius));

    return gate_container;

}

function create_input_lines() {

    var i;
    var input_x_pos;
    var container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < input_signal_names.length; i++) {

        input_x_pos = edge_distance + (input_line_seperation * i);

        container.appendChild(create_text(input_signal_names[i],input_x_pos, edge_distance));
        container.appendChild(create_input_line(input_x_pos,edge_distance + horizontal_input_distance,input_line_negation_size + 2 * horizontal_input_distance));
        container.appendChild(create_input_line_negation(input_x_pos,edge_distance + 2 * horizontal_input_distance));

    }

    current_height += edge_distance + (10 * distance);

    return container;

}

function extend_input_lines(length) {

    var i;
    var top_distance = edge_distance + horizontal_input_distance + input_line_negation_size + 2 * horizontal_input_distance;
    var container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < input_signal_names.length; i++) {

        container.appendChild(create_input_line(edge_distance + (input_line_seperation * i),top_distance,length - top_distance));
        container.appendChild(create_input_line(edge_distance + (input_line_seperation * i) + vertical_input_negation_distance,top_distance,length - top_distance));

    }

    return container;

}

function create_input_line(x_pos, y_pos, length) {

    return create_line(x_pos,y_pos,x_pos,y_pos+length);

}

function create_line(x_pos1, y_pos1, x_pos2, y_pos2) {

    var input_line = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    input_line.setAttribute('d','M ' + x_pos1 + ' ' + y_pos1 + ' L ' + x_pos2 + ' ' + y_pos2);
    set_path_properties(input_line);

    if(current_width < x_pos2){
        current_width = x_pos2;
    }

    return input_line;

}

function create_input_line_negation(x_pos, y_pos) {

    var negation_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    var negation_box = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var negation_connectors = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    var negation_y_pos = y_pos + horizontal_input_distance/2;
    var negation_x_pos = x_pos + vertical_input_negation_distance;

    negation_container.appendChild(create_connection(x_pos, y_pos, negation_radius));

    negation_connectors.setAttribute('d',
        'M ' + x_pos + ' ' + y_pos + ' ' +
        'L ' + negation_x_pos + ' ' + y_pos + ' ' +
        'L '  + negation_x_pos + ' ' + negation_y_pos + ' ' +
        'M ' + negation_x_pos + ' ' + (negation_y_pos + input_line_negation_size) + ' ' +
        'L '  + negation_x_pos + ' ' + (negation_y_pos + input_line_negation_size + horizontal_input_distance/2)
    );
    negation_connectors.setAttribute('fill', 'none');
    set_path_properties(negation_connectors);

    negation_box.setAttribute('d',
        'M ' + negation_x_pos + ' ' + (negation_y_pos + input_line_negation_size) + ' ' +
        'L ' + (negation_x_pos - (input_line_negation_size/2)) + ' ' + negation_y_pos + ' ' +
        'L ' + (negation_x_pos + (input_line_negation_size/2)) + ' ' + negation_y_pos + ' ' +
        'Z'
    );
    set_path_properties(negation_box);

    negation_container.appendChild(negation_connectors);
    negation_container.appendChild(negation_box);

    return negation_container;

}

function create_text(text, x_pos, y_pos) {

	var text_node = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text_node.setAttribute("x",x_pos);
	text_node.setAttribute("y",y_pos);
    set_text_properties(text_node);

    text_node.appendChild(document.createTextNode(text));

    return text_node;

}

function create_negation(x_pos, y_pos) {

    var negation = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");

	negation.setAttribute("cx",x_pos + negation_radius/2);
    negation.setAttribute("cy",y_pos);
    set_ellipse_properies(negation, negation_radius);
    negation.setAttribute("fill", "none");

    return negation;

}

function create_connection(x_pos, y_pos, radius) {

    var connection = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");

	connection.setAttribute("cx",x_pos);
    connection.setAttribute("cy",y_pos);

    set_ellipse_properies(connection, radius);

    return connection;

}

function set_path_properties(path) {

    path.setAttribute('fill', 'none');
    if(svg_darkmode) {
        path.setAttribute('stroke', '#ffffff');
    }else{
        path.setAttribute('stroke', '#000000');
    }
    path.setAttribute('stroke-miterlimit', '10');
    path.setAttribute('id', 'path' + (num_paths++));
    path.setAttribute('pointer-events', 'none');

}

function set_text_properties(text) {

    if(svg_darkmode) {
        text.setAttribute('fill', '#ffffff');
    }else{
        text.setAttribute('fill', '#000000');
    }
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute('font-size', '12px');
    text.setAttribute('font-family', 'Helvetica');
    text.setAttribute('id', 'svg_text_node_' + (num_texts++));

}

function set_ellipse_properies(ellipse, radius) {

    ellipse.setAttribute("rx",radius/2);
    ellipse.setAttribute("ry",radius/2);
    if(svg_darkmode){
        ellipse.setAttribute('fill', '#ffffff');
        ellipse.setAttribute('stroke', '#ffffff');
    }else{
        ellipse.setAttribute('fill', '#000000');
        ellipse.setAttribute('stroke', '#000000');
    }
    ellipse.setAttribute('id', 'ellipse' + (num_ellipses++));
    ellipse.setAttribute('pointer-events', 'none');

}

function svg_variable_change() {

    // ids = "gate_distance_vert", "gate_distance_hori", "input_line_distance", "negation_radius"

    vertical_gate_distance = parseInt(document.getElementById("gate_distance_vert").value,10) * distance;
    horizontal_gate_distance = parseInt(document.getElementById("gate_distance_hori").value,10) * distance;
    input_line_seperation = parseInt(document.getElementById("input_line_distance").value,10) * distance;
    negation_radius = (parseInt(document.getElementById("negation_radius").value,10) * distance) / 10;

    create_svg();

}

function toggle_svg_darkmode() {

    if(svg_darkmode) {
        document.getElementById("svg_darkmode_label").innerText = "SVG Lightmode";
    }else{
        document.getElementById("svg_darkmode_label").innerText = "SVG Darkmode";
    }

    svg_darkmode = !svg_darkmode;

    create_svg();

}

function toggle_svg_display() {

    document.getElementById("svg_display_label").innerText = "Display Negation at " + negation_pos;

    negation_pos = ((negation_pos == 'Gates') ? 'Input_Lines' : 'Gates');

    create_svg();

}
