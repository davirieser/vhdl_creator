
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
var current_height = 100;

var gate_height_per_input = 25;
var gate_width = 50;

var distance = 5;

function create_svg(packets) {

    var i;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute('style', 'background-color: rgb(255, 255, 255);');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    svg.appendChild(create_input_lines());

    // svg.appendChild(extend_input_lines(50));

    svg.appendChild(create_gate(200, 10, 3, "&"));
    svg.appendChild(create_gate(400, 10, 3, "≥1"));

    if(packets && packets.length > 0) {

        for (i = 0; i < packets.length; i++) {

            draw_packet(packets[i]);

        }

    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    return svg;

}

function

function create_gate(x_pos, y_pos, num_inputs, symbol, negated) {

    var i;
    var gate_input_length = distance * 2;
    var gate_container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    var gate_outline = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var gate_connectors = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    gate_container.appendChild(create_text(symbol, (x_pos + (gate_width)/2), (y_pos + ((gate_height_per_input * (num_inputs + (1/2)))/4))));

    var input_lines = '';
    for (i = 0; i < num_inputs  ; i ++) {
        // Create Input Connectors
        input_lines += 'M ';
        input_lines += x_pos + ' ' + (y_pos + ((gate_height_per_input * (i + (1/2)))/2));
        input_lines += ' L ';
        input_lines += (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * (i + (1/2)))/2)) + ' ';
    }

    // Create Output Connectors
    input_lines +=
        ' M ' + (x_pos + gate_width) + ' ' + (y_pos + ((gate_height_per_input * num_inputs)/4))+
        ' L ' + (x_pos + gate_width + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * num_inputs)/4));

    gate_connectors.setAttribute('d', input_lines);
    gate_connectors.setAttribute('fill', 'none');
    gate_connectors.setAttribute('stroke', '#000000');
    gate_connectors.setAttribute('stroke-miterlimit', '10');
    gate_connectors.setAttribute('pointer-events', 'none');
    gate_connectors.setAttribute('id', 'path' + (num_paths++));

    gate_outline.setAttribute('d',
        'M ' + (x_pos + gate_input_length) + ' ' + y_pos + ' L ' + (x_pos + gate_width) + ' ' + y_pos +
        // ' C ' + (x_pos + (gate_width/4)) + ' ' + y_pos + ' ' +
        //         (x_pos + ((5*gate_width)/3)) + ' ' + (y_pos + ((gate_height_per_input*num_inputs)/4)) + ' ' +
        //         (x_pos + (gate_width/2)) + ' ' + (y_pos + ((gate_height_per_input*num_inputs)/2)) +
        // ' C ' + (x_pos + (gate_width/2)) + ' ' + (y_pos + ((gate_height_per_input*num_inputs)/2)) + ' ' +
        //         (x_pos + ((5*gate_width)/3)) + ' ' + (y_pos + ((3*gate_height_per_input*num_inputs)/4)) + ' ' +
        //         (x_pos + (gate_width/4)) + ' ' + (y_pos + (gate_height_per_input*num_inputs)) +
        ' L ' + (x_pos + gate_width) + ' ' + (y_pos + ((gate_height_per_input * num_inputs)/2)) +
        ' L ' + (x_pos + gate_input_length) + ' ' + (y_pos + ((gate_height_per_input * num_inputs)/2)) +
        ' Z'
    );
    gate_outline.setAttribute('fill', 'none');
    gate_outline.setAttribute('stroke', '#000000');
    gate_outline.setAttribute('stroke-miterlimit', '10');
    gate_outline.setAttribute('pointer-events', 'none');
    gate_outline.setAttribute('id', 'path' + (num_paths++));

    gate_container.appendChild(gate_connectors);
    gate_container.appendChild(gate_outline);

    return gate_container;

}

function create_input_lines() {

    var i;
    var header_y_pos = 20;
    var line_spacing = 10;
    var column_spacing;
    var container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < input_signal_names.length; i++) {

        column_spacing = (5 * distance) + (i * 10 * distance);

        container.appendChild(create_text(input_signal_names[i],column_spacing, header_y_pos));
        container.appendChild(create_input_line(column_spacing,(header_y_pos + line_spacing),(line_spacing + (distance * 4))));
        container.appendChild(create_input_line_negation(column_spacing,(header_y_pos + (2 * line_spacing))));

    }

    return container;

}

function extend_input_lines(length) {

    var i;
    var header_y_pos = 20;
    var line_spacing = 10;
    var column_spacing;
    var container = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    for(i = 0; i < input_signal_names.length; i++) {

        column_spacing = (5 * distance) + (i * 10 * distance);

        container.appendChild(create_input_line(column_spacing,(header_y_pos + (2 * line_spacing) + (distance * 4)),length));
        container.appendChild(create_input_line((column_spacing + (2 * distance)),(header_y_pos + (2 * line_spacing) + (distance * 4)),length));

    }

    return container;

}

function create_input_line(x_pos, y_pos, length) {

    var input_line = document.createElementNS("http://www.w3.org/2000/svg", 'path');

    input_line.setAttribute('d','M ' + x_pos + " " + y_pos + " L " + x_pos + " " + (y_pos + length) + " Z");
    input_line.setAttribute('fill', 'none');
    input_line.setAttribute('stroke', '#000000');
    input_line.setAttribute('stroke-miterlimit', '10');
    input_line.setAttribute('id', 'path' + (num_paths++));
    input_line.setAttribute('pointer-events', 'none');

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
    // negation_connectors.setAttribute('transform', 'rotate(90,' + x_pos + ',' + (y_pos + 5) + ')');
    negation_connectors.setAttribute('pointer-events', 'none');
    negation_connectors.setAttribute('id', 'path' + (num_paths++));

    negation_box.setAttribute('d',
        'M ' + (x_pos + distance) + ' ' + (y_pos + distance) +
        ' L ' + (x_pos + (2 * distance)) + ' ' + (y_pos + (3 * distance)) +
        ' L ' + (x_pos + (3 * distance)) + ' ' + (y_pos + distance) + ' Z');
    negation_box.setAttribute('fill', '#ffffff');
    negation_box.setAttribute('stroke', '#000000');
    negation_box.setAttribute('stroke-miterlimit', '10');
    // negation_box.setAttribute('transform', 'rotate(90,' + x_pos + ',' + (y_pos + 5) + ')');
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
	text_node.setAttributeNS(null,"x",x_pos);
	text_node.setAttributeNS(null,"y",y_pos);
    text_node.setAttribute('fill', '#000000');
    text_node.setAttribute('text-anchor', 'middle');
    text_node.setAttribute('font-size', '12px');
    text_node.setAttribute('font-family', 'Helvetica');
    // text_node.setAttribute('transform', 'translate(2.5,1.5)');
    text_node.setAttribute('id', 'text' + (num_texts++));

    text_node.appendChild(document.createTextNode(text));

    return text_node;

}

function create_connection(x_pos, y_pos) {

    // <ellipse xmlns="http://www.w3.org/2000/svg" cx="27" cy="50" rx="3" ry="3" fill="#000000" stroke="#000000" pointer-events="none" id="ellipse14"/>

    var connection = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
	connection.setAttributeNS(null,"cx",x_pos);
    connection.setAttributeNS(null,"cy",y_pos);
    connection.setAttributeNS(null,"rx",3);
    connection.setAttributeNS(null,"ry",3);
    connection.setAttribute('fill', 'none');
    connection.setAttribute('stroke', '#000000');
    connection.setAttribute('id', 'ellipse' + (num_ellipses++));
    connection.setAttribute('pointer-events', 'none');

    return connection;

}
