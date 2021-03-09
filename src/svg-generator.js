
/* -----------------------------------------------------------------------------
--------------------------------------------------------------------------------
----- SVG-Functions ------------------------------------------------------------
--------------------------------------------------------------------------------
----------------------------------------------------------------------------- */

var num_paths = 0;
var num_gates = 0;
var num_negations = 0;
var num_ellipses = 0;
var num_texts = 0;
var line_spacing = 10;
var header_y_pos = 20;

var current_height = 0;
var current_width = 0;

var gate_height_per_input = 25;
var gate_width = 60;

var distance = 5;

var negation_pos = "Input Lines";

var and_operator = "&";
var or_operator = "≥1";

var gate_outputs = [];

function create_svg() {

    var i, j;
    var curr_gate = 0;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    current_height = 0;
    gate_outputs = [];

    if(document.getElementById('svg_circuit')){
        document.getElementById("svg_container").removeChild(document.getElementById('svg_circuit'));
    }

    svg.setAttribute('id', 'svg_circuit');
    svg.setAttribute('style', 'background-color: rgb(255, 255, 255);');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    svg.appendChild(create_input_lines());

    for (i = 0; i < output_packets.length; i ++) {
        if(output_packets[i] && (output_packets[i].length > 0)) {
            for (j = 0; j < output_packets[i].length; j++) {
                svg.appendChild(draw_packet(output_packets[i][j], true));
                curr_gate++;
            }
            current_height += 3 * distance;
            svg.appendChild(connect_packet_outputs((curr_gate - j),j));
            svg.appendChild(create_text(output_signal_names[i], gate_outputs[curr_gate].x_pos + (3 * distance), gate_outputs[curr_gate].y_pos));
            curr_gate++;
        }
    }

    svg.appendChild(extend_input_lines(current_height));

    // svg.setAttribute('width', current_width + 5 * distance);
    // svg.setAttribute('height', current_height + header_y_pos);
    svg.setAttribute('viewBox', '0 0 ' + (current_width + 5 * distance) + ' ' + (current_height + header_y_pos));

    document.getElementById("svg_container").appendChild(svg);

}

function draw_packet(packet, connect_inputs) {

    var i;
    var negated = negated_from_packet(packet);

    // FIXME: Breaks if negated.length <= 1

    var edge_distance = (5 * distance) + (num_inputs * 10 * distance);
    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var gate_heigth = current_height;

    gate_container.appendChild(create_gate(edge_distance, current_height, and_operator, negated));
    gate_container.appendChild(connect_gate_inputs(edge_distance, gate_heigth, negated));

    current_height += ((negated.length * gate_height_per_input) / 2) + distance;

    return gate_container;

}

function create_gate(x_pos, y_pos, symbol, negated) {

    var i;

    var gate_input_length = distance * 2;
    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var gate_outline = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var gate_connectors = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    if(negated.length > 1) {

        // Create Operator-Text
        gate_container.appendChild(create_text(symbol, (x_pos + (gate_width)/(32/19)), (y_pos + ((gate_height_per_input * (negated.length + (1/2)))/4))));

        var input_lines = '';
        for (i = 0; i < negated.length  ; i ++) {
            // Create Input Connectors
            input_lines += 'M ';
            input_lines += x_pos + ' ' + (y_pos + ((gate_height_per_input * (i + (1/2)))/2));
            input_lines += ' L ';
            if((negation_pos == "Gates")) {
                if(!negated[i].negated){
                    input_lines += (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * (i + (1/2)))/2)) + ' ';
                }else{
                    input_lines += (x_pos + gate_input_length - distance) + ' ' + (y_pos + ((gate_height_per_input * (i + (1/2)))/2)) + ' ';
                    gate_container.appendChild(create_negation(x_pos + distance, (y_pos + ((gate_height_per_input * (i + (1/2)))/2))));
                }
            }else{
                input_lines += (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * (i + (1/2)))/2)) + ' ';
            }
        }

        // Create Output Connectors
        input_lines +=
            ' M ' + (x_pos + gate_width) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4))+
            ' L ' + (x_pos + gate_width + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4));

        gate_outline.setAttribute('d',
        // Upper Edge
            'M '  + (x_pos + gate_input_length) + ' ' + y_pos +
            ' L ' + (x_pos + gate_input_length + (gate_width/2)) + ' ' + y_pos +
        // Curve to Output
            ' C ' + (x_pos + gate_input_length + (gate_width/2)) + ' ' + y_pos + ' ' +
                (x_pos + gate_input_length + ((3*gate_width)/4)) + ' ' + (y_pos) + ' ' +
                (x_pos + gate_width) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
        // Curve from Output to Bottom Edge
            ' C ' + (x_pos + gate_width) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) + ' ' +
                (x_pos + gate_input_length + ((3*gate_width)/4)) + ' ' + (y_pos + (gate_height_per_input * negated.length)/2) + ' ' +
                (x_pos + gate_input_length + (gate_width/2)) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/2)) +
        // Bottom Edge
            ' L ' + (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/2)) +
        // Left Edge
            ' Z'
        );

    }else{

        // Create Output Connectors
        var input_lines = '';

        if((negation_pos != "Gates")) {
            if(!negated[0].negated){
                input_lines += 'M ' + x_pos + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
                                ' L ' + (x_pos + gate_width + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4));
            }else{
                input_lines += 'M ' + x_pos + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
                                ' L ' + (x_pos + gate_width + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4));
                // gate_container.appendChild(create_negation((x_pos + gate_width + gate_input_length - distance), (y_pos + ((gate_height_per_input * negated.length)/4))));
            }
        }else{

            if(negated[0].negated){

                // Create Operator-Text
                gate_container.appendChild(create_text("1", (x_pos + (gate_width)/(32/19)), (y_pos + ((gate_height_per_input * (negated.length + (1/2)))/4))));

                input_lines += 'M ' + x_pos + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
                                ' L ' + (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
                                'M ' + (x_pos + gate_width + distance) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
                                ' L ' + (x_pos + gate_width + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4));;

                gate_container.appendChild(create_negation((x_pos + gate_width), (y_pos + ((gate_height_per_input * negated.length)/4))));

                gate_outline.setAttribute('d',
                // Start Positiion
                    'M '  + (x_pos + gate_input_length) + ' ' + y_pos +
                // Upper Edge
                    ' L ' + (x_pos + gate_width) + ' ' + y_pos +
                // Right Edge
                    ' L ' + (x_pos + gate_width) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/2)) +
                // Bottom Edge
                    ' L ' + (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/2)) +
                // Left Edge
                    ' Z'
                );

            }else{
                input_lines += 'M ' + x_pos + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4)) +
                                ' L ' + (x_pos + gate_width + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * negated.length)/4));
            }
        }

    }

    gate_outputs.push(
        {
            x_pos: x_pos + gate_width + gate_input_length,
            y_pos: y_pos + ((gate_height_per_input * negated.length)/4)
        }
    );

    gate_outline.setAttribute('fill', 'none');
    gate_outline.setAttribute('stroke', '#000000');
    gate_outline.setAttribute('stroke-miterlimit', '10');
    gate_outline.setAttribute('pointer-events', 'none');
    gate_outline.setAttribute('id', 'path' + (num_paths++));

    gate_connectors.setAttribute('d', input_lines);
    gate_connectors.setAttribute('fill', 'none');
    gate_connectors.setAttribute('stroke', '#000000');
    gate_connectors.setAttribute('stroke-miterlimit', '10');
    gate_connectors.setAttribute('pointer-events', 'none');
    gate_connectors.setAttribute('id', 'path' + (num_paths++));

    gate_container.appendChild(gate_connectors);
    gate_container.appendChild(gate_outline);

    if(current_width < (x_pos + gate_width + gate_input_length)){
        current_width = (x_pos + gate_width + gate_input_length);
    }

    return gate_container;

}

function connect_gate_inputs(x_pos, y_pos, negated) {

    var i;
    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < negated.length; i ++){
        gate_container.appendChild(connect_gate_input(x_pos, (y_pos + ((gate_height_per_input * (i + (1/2)))/2)), negated[i].input_name, negated[i].negated));
    }

    return gate_container;

}

function connect_gate_input(x_pos, y_pos, input, negated) {

    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    var gate_connection = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    var x_pos_input = ((5 * distance) + (input * 10 * distance) + (line_spacing * ((negation_pos != "Gates") * negated)));

    gate_connection.setAttribute('d','M ' + x_pos_input + ' ' + y_pos + ' L ' + x_pos + ' ' + y_pos);
    gate_connection.setAttribute('fill', 'none');
    gate_connection.setAttribute('stroke', '#000000');
    gate_connection.setAttribute('stroke-miterlimit', '10');
    gate_connection.setAttribute('id', 'path' + (num_paths++));
    gate_connection.setAttribute('pointer-events', 'none');

    gate_container.appendChild(gate_connection);
    gate_container.appendChild(create_connection(x_pos_input, y_pos));

    return gate_container;

}

function create_input_lines() {

    var i;
    var header_y_pos = 20;
    var column_spacing;
    var container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < input_signal_names.length; i++) {

        column_spacing = (5 * distance) + (i * 10 * distance);

        container.appendChild(create_text(input_signal_names[i],column_spacing, header_y_pos));
        container.appendChild(create_input_line(column_spacing,(header_y_pos + line_spacing),(line_spacing + (distance * 4))));
        container.appendChild(create_input_line_negation(column_spacing,(header_y_pos + (2 * line_spacing))));

    }

    current_height += header_y_pos + (2 * line_spacing) + (10 * distance);

    return container;

}

function extend_input_lines(length) {

    var i;
    var column_spacing;
    var top_distance = (header_y_pos + (2 * line_spacing) + (distance * 4));
    var container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < input_signal_names.length; i++) {

        column_spacing = (5 * distance) + (i * 10 * distance);

        container.appendChild(create_input_line(column_spacing,top_distance,length - top_distance));
        container.appendChild(create_input_line((column_spacing + (2 * distance)),top_distance,length - top_distance));

    }

    return container;

}

function create_input_line(x_pos, y_pos, length) {

    return create_line(x_pos,y_pos,x_pos,y_pos+length);

}

function create_line(x_pos1, y_pos1, x_pos2, y_pos2) {

    var input_line = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    input_line.setAttribute('d','M ' + x_pos1 + ' ' + y_pos1 + ' L ' + x_pos2 + ' ' + y_pos2);
    input_line.setAttribute('fill', 'none');
    input_line.setAttribute('stroke', '#000000');
    input_line.setAttribute('stroke-miterlimit', '10');
    input_line.setAttribute('id', 'path' + (num_paths++));
    input_line.setAttribute('pointer-events', 'none');

    if(current_width < x_pos2){
        current_width = x_pos2;
    }

    return input_line;

}

function create_input_line_negation(x_pos, y_pos) {

    // <path xmlns="http://www.w3.org/2000/svg" d="M 7 20 L 26.5 20" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="none" id="path36"/>
    // <path xmlns="http://www.w3.org/2000/svg" d="M 14 32.5 L 19 32.5 M 34 32.5 L 39 32.5" fill="none" stroke="#000000" stroke-miterlimit="10" transform="rotate(90,26.5,32.5)" pointer-events="none" id="path30"/>
    // <path xmlns="http://www.w3.org/2000/svg" d="M 19 25 L 34 32.5 L 19 40 Z" fill="#ffffff" stroke="#000000" stroke-miterlimit="10" transform="rotate(90,26.5,32.5)" pointer-events="none" id="path32"/>

    var negation_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    var line_connector = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var negation_box = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var negation_connectors = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    create_connection(x_pos,y_pos);

    line_connector.setAttribute('d','M ' + x_pos + ' ' + y_pos + ' L ' + (x_pos + (2 * distance)) + ' ' + y_pos + ' Z');
    line_connector.setAttribute('fill', 'none');
    line_connector.setAttribute('stroke', '#000000');
    line_connector.setAttribute('stroke-miterlimit', '10');
    line_connector.setAttribute('pointer-events', 'none');
    line_connector.setAttribute('id', 'path' + (num_paths++));

    negation_connectors.setAttribute('d',
        'M ' + (x_pos + (2 * distance)) + ' ' + y_pos +
        ' L '  + (x_pos + (2 * distance)) + ' ' + (y_pos + distance) +
        'M ' + (x_pos + (2 * distance)) + ' ' + (y_pos + (3 * distance)) +
        ' L '  + (x_pos + (2 * distance)) + ' ' + (y_pos + (4 * distance)));
    negation_connectors.setAttribute('fill', 'none');
    negation_connectors.setAttribute('stroke', '#000000');
    negation_connectors.setAttribute('stroke-miterlimit', '10');
    negation_connectors.setAttribute('pointer-events', 'none');
    negation_connectors.setAttribute('id', 'path' + (num_paths++));

    negation_box.setAttribute('d',
        'M ' + (x_pos + distance) + ' ' + (y_pos + distance) +
        ' L ' + (x_pos + (2 * distance)) + ' ' + (y_pos + (3 * distance)) +
        ' L ' + (x_pos + (3 * distance)) + ' ' + (y_pos + distance) + ' Z');
    negation_box.setAttribute('fill', '#ffffff');
    negation_box.setAttribute('stroke', '#000000');
    negation_box.setAttribute('stroke-miterlimit', '10');
    negation_box.setAttribute('pointer-events', 'none');
    negation_box.setAttribute('id', 'path' + (num_paths++));

    negation_container.appendChild(line_connector);
    negation_container.appendChild(negation_connectors);
    negation_container.appendChild(negation_box);

    return negation_container;

}

function create_text(text, x_pos, y_pos) {

    // <text xmlns="http://www.w3.org/2000/svg" x="8" y="13" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica" id="text148">≥1</text>
    // <text xmlns="http://www.w3.org/2000/svg" x="4" y="12" fill="#000000" text-anchor="middle" font-size="12px" font-family="Helvetica" id="text154">&amp;</text>

	var text_node = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text_node.setAttribute("x",x_pos);
	text_node.setAttribute("y",y_pos);
    text_node.setAttribute('fill', '#000000');
    text_node.setAttribute('text-anchor', 'middle');
    text_node.setAttribute('font-size', '12px');
    text_node.setAttribute('font-family', 'Helvetica');
    text_node.setAttribute('id', 'text' + (num_texts++));

    text_node.appendChild(document.createTextNode(text));

    return text_node;

}

function create_negation(x_pos, y_pos) {

    // <ellipse xmlns="http://www.w3.org/2000/svg" cx="302" cy="40" rx="3" ry="3" fill="#ffffff" stroke="#000000" pointer-events="none" id="ellipse70"/>

    var negation = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");

	negation.setAttribute("cx",x_pos + distance/2);
    negation.setAttribute("cy",y_pos);
    negation.setAttribute("rx",distance/2);
    negation.setAttribute("ry",distance/2);
    negation.setAttribute('fill', '#ffffff');
    negation.setAttribute('stroke', '#000000');
    negation.setAttribute('pointer-events', 'none');
    negation.setAttribute('id', 'ellipse' + (num_ellipses++));

    return negation;

}

function create_connection(x_pos, y_pos) {

    // <ellipse xmlns="http://www.w3.org/2000/svg" cx="27" cy="50" rx="3" ry="3" fill="#000000" stroke="#000000" pointer-events="none" id="ellipse14"/>

    var connection = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
	connection.setAttribute("cx",x_pos);
    connection.setAttribute("cy",y_pos);
    connection.setAttribute("rx",distance/2);
    connection.setAttribute("ry",distance/2);
    connection.setAttribute('fill', '#000000');
    connection.setAttribute('stroke', '#000000');
    connection.setAttribute('id', 'ellipse' + (num_ellipses++));
    connection.setAttribute('pointer-events', 'none');

    return connection;

}

function connect_packet_outputs(gate_start_index, num_gates) {

    var i;
    var break_distance = 0;
    var median_heigth = 0;
    var negated = [];

    var connection;
    var container = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (i = 0; i < num_gates; i ++) {
        median_heigth += gate_outputs[gate_start_index + i].y_pos;
        negated.push({input_name: "Moin",negated: false});
    }

    if((num_gates % 2) != 0) {
        median_heigth = gate_outputs[gate_start_index + ((num_gates + 1)/2) - 1].y_pos;
        median_heigth -= (gate_height_per_input * num_gates)/4;
    }else{
        median_heigth /= num_gates;
        median_heigth -= (gate_height_per_input * num_gates)/4;
    }

    for(i = 0; i < num_gates; i ++) {

        // TODO Doesn't work if num_inputs is dividable by 2
        break_distance = 2 * line_spacing * ((Math.abs(Math.floor(num_gates/2) - i) / (num_gates/2)));

        connection = document.createElementNS("http://www.w3.org/2000/svg", "path");

        connection.setAttribute('d',
            'M ' + gate_outputs[gate_start_index + i].x_pos + ' ' + gate_outputs[gate_start_index + i].y_pos +
            ' L ' + (gate_outputs[gate_start_index + i].x_pos + break_distance) + ' ' + gate_outputs[gate_start_index + i].y_pos +
            ' L ' + (gate_outputs[gate_start_index + i].x_pos + break_distance) + ' ' + (median_heigth + ((i + (1/2)) * gate_height_per_input)/2) +
            ' L ' + (gate_outputs[gate_start_index + i].x_pos + 2 * line_spacing) + ' ' + (median_heigth + ((i + (1/2)) * gate_height_per_input)/2)
        );
        connection.setAttribute('fill', 'none');
        connection.setAttribute('stroke', '#000000');
        connection.setAttribute('stroke-miterlimit', '10');
        connection.setAttribute('id', 'path' + (num_paths++));
        connection.setAttribute('pointer-events', 'none');

        container.appendChild(connection);

    }

    container.appendChild(create_gate((gate_outputs[0].x_pos + 2 * line_spacing), median_heigth, or_operator, negated));

    return container;

}
