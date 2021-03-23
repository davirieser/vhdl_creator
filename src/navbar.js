
function create_navbar(title, title_href) {

    // Check that Navbar wasn't already created
    if (!document.getElementById("navbarSupportedContent")) {

        // Create Navbar Container
        var navbar = document.createElement("nav");
        navbar.id = "navbar_container";
        navbar.classList += "navbar fixed-top navbar-expand-lg navbar-dark bg-dark";

        // Create Toggle Switch for Navbar Collapsing
        var navbar_toggler_span = document.createElement("span");
        navbar_toggler_span.classList += "navbar-toggler-icon";

        var navbar_toggler = document.createElement("button");
        navbar_toggler.type = "button";
        // navbar_toggler.dataset["toggle"] = "collapse";
        navbar_toggler.dataset["bsToggle"] = "collapse";
        // navbar_toggler.dataset["target"] = "#navbarSupportedContent";
        navbar_toggler.dataset["bsTarget"] = "#navbarSupportedContent";
        navbar_toggler.classList += "navbar-toggler";
        navbar_toggler.appendChild(navbar_toggler_span);

        // Create Collapsable Navbar Container
        var collapsable_navbar_container = document.createElement("div");
        collapsable_navbar_container.id = "navbarSupportedContent";
        collapsable_navbar_container.classList += "collapse navbar-collapse mr-auto";

        // Create Title Link
        navbar.appendChild(return_navbar_title(title, title_href));

        // Put all Components into the Navbar Container
        navbar.appendChild(navbar_toggler);
        navbar.appendChild(collapsable_navbar_container);

        // Put Navbar into DOM
        document.body.appendChild(navbar);

    }

}

function create_navbar_from_object(title) {

    // Check that Navbar wasn't already created
    if (!document.getElementById("navbarSupportedContent")) {

        // Create Navbar Container
        var navbar = document.createElement("nav");
        navbar.id = "navbar_container";
        navbar.classList += "navbar fixed-top navbar-expand-lg navbar-dark bg-dark";

        // Create Toggle Switch for Navbar Collapsing
        var navbar_toggler_span = document.createElement("span");
        navbar_toggler_span.classList += "navbar-toggler-icon";

        var navbar_toggler = document.createElement("button");
        navbar_toggler.type = "button";
        // navbar_toggler.dataset["toggle"] = "collapse";
        navbar_toggler.dataset["bsToggle"] = "collapse";
        // navbar_toggler.dataset["target"] = "#navbarSupportedContent";
        navbar_toggler.dataset["bsTarget"] = "#navbarSupportedContent";
        navbar_toggler.classList += "navbar-toggler";
        navbar_toggler.appendChild(navbar_toggler_span);

        // Create Collapsable Navbar Container
        var collapsable_navbar_container = document.createElement("div");
        collapsable_navbar_container.id = "navbarSupportedContent";
        collapsable_navbar_container.classList += "collapse navbar-collapse mr-auto";

        // Create Title Link
        navbar.appendChild(return_navbar_title(title.text, title.href));

        // Put all Components into the Navbar Container
        navbar.appendChild(navbar_toggler);
        navbar.appendChild(collapsable_navbar_container);

        // Put Navbar into DOM
        document.body.appendChild(navbar);

    }

}

function create_navbar_title(title, title_href) {

    // Guard Clause to check that the Navbar exists and no Title exists in it
    if( (document.getElementById("navbar_title_link")) ||
        (!document.getElementById("navbar_container"))) {
            return;
    }

    // Create Title Link
    var title_link = document.createElement("a");
    title_link.appendChild(document.createTextNode(title));
    title_link.href = title_href;
    title_link.id = "navbar_title_link";
    title_link.classList += "navbar-brand";

    // Add Title Link to Navbar as first Element
    document.getElementById("navbar_container").prepend(title_link)

}

function return_navbar_title(title, title_href) {

    // Create Title Link
    var title_link = document.createElement("a");
    title_link.appendChild(document.createTextNode(title));
    title_link.href = title_href;
    title_link.id = "navbar_title_link";
    title_link.classList += "navbar-brand";

    // Return Title Link
    return title_link;

}

function remove_navbar_title() {

    if(document.getElementById("navbar_title_link")){
        document.getElementById("navbar_title_link").remove();
    }

}

function add_link_to_navbar(text, href) {

    // Check that Navbar was already created
    if (document.getElementById("navbarSupportedContent")) {

        var container = document.createElement("div");
        container.classList += "nav-item active mr-auto";

        var link = document.createElement("a");
        link.href = href;
        link.classList += "nav-link mr-auto";
        link.appendChild(document.createTextNode(text));

        container.appendChild(link);

        document.getElementById("navbarSupportedContent").appendChild(container);

    }

}

function add_link_from_object_to_navbar(object) {

    // Check that Navbar was already created
    if (document.getElementById("navbarSupportedContent")) {

        var container = document.createElement("div");
        container.classList += "nav-item active mr-auto";

        var link = document.createElement("a");
        link.href = object.href;
        link.classList += "nav-link mr-auto";
        link.appendChild(document.createTextNode(object.text));

        container.appendChild(link);

        document.getElementById("navbarSupportedContent").appendChild(container);

    }

}

function add_dropdown_to_navbar(dropdown_text, link_texts, link_hrefs) {

    // Check that Navbar was already created
    if (document.getElementById("navbarSupportedContent")) {

        var i;

        var container = document.createElement("div");
        container.classList += "nav-item dropdown mr-auto";

        // Create Dropdown-Link
        var nav_link = document.createElement("a");
        nav_link.id = "navbarDropdownMenuLink";
        nav_link.href = "#";
        // nav_link.dataset["toggle"] = "dropdown";
        nav_link.dataset["bsToggle"] = "dropdown";
        nav_link.appendChild(document.createTextNode(dropdown_text));
        nav_link.classList += "nav-link dropdown-toggle mr-auto";

        // Create Links inside the Dropdown
        var dropdown_links = document.createElement("ul");
        dropdown_links.classList += "dropdown-menu navbar-dark bg-dark";

        // Variable Declarations
        var dropdown_link;
        var dropdown_link_container;

        for (i = 0; i < link_texts.length; i++) {

            // Create Container for Link so the Links will appear as a List
            dropdown_link_container = document.createElement("li");
            dropdown_link_container.classList += "dropdown-item navbar-dark bg-dark";

            // Check if String is empty
            if(link_texts[i]) {

                // Create actual Link
                dropdown_link = document.createElement("a");
                dropdown_link.appendChild(document.createTextNode(link_texts[i]));
                dropdown_link.href = link_hrefs[i];
                dropdown_link.classList += "nav-link active dropdown-item navbar-dark bg-dark";

            }else{

                // Create Dropdown-Divider
                dropdown_link = document.createElement("hr");
                dropdown_link.classList += "dropdown-divider";

            }

            dropdown_link_container.appendChild(dropdown_link);

            // Add the Container to the Dropdown
            dropdown_links.appendChild(dropdown_link_container);

        }

        container.appendChild(nav_link);
        container.appendChild(dropdown_links);

        document.getElementById("navbarSupportedContent").appendChild(container);

    }

}

function add_dropdown_from_object_to_navbar(dropdown_text, links) {

    // Check that Navbar was already created
    if (document.getElementById("navbarSupportedContent")) {

        var i;

        var container = document.createElement("div");
        container.classList += "nav-item dropdown mr-auto";

        // Create Dropdown-Link
        var nav_link = document.createElement("a");
        nav_link.id = "navbarDropdownMenuLink";
        nav_link.href = "#";
        // nav_link.dataset["toggle"] = "dropdown";
        nav_link.dataset["bsToggle"] = "dropdown";
        nav_link.appendChild(document.createTextNode(dropdown_text));
        nav_link.classList += "nav-link dropdown-toggle mr-auto";

        // Create Links inside the Dropdown
        var dropdown_links = document.createElement("ul");
        dropdown_links.classList += "dropdown-menu navbar-dark bg-dark";

        // Variable Declarations
        var dropdown_link;
        var dropdown_link_container;

        console.log("Links : " + links.length);

        for (i = 0; i < links.length; i++) {

            console.log("Link : " + JSON.stringify(links[i]));

            // Create Container for Link so the Links will appear as a List
            dropdown_link_container = document.createElement("li");
            dropdown_link_container.classList += "dropdown-item navbar-dark bg-dark";

            // Check if String is empty
            if(links[i].text) {

                // Create actual Link
                dropdown_link = document.createElement("a");
                dropdown_link.appendChild(document.createTextNode(links[i].text));
                dropdown_link.href = links[i].href;
                dropdown_link.classList += "nav-link active dropdown-item navbar-dark bg-dark";

            }else{

                // Create Dropdown-Divider
                dropdown_link = document.createElement("hr");
                dropdown_link.classList += "dropdown-divider";

            }

            dropdown_link_container.appendChild(dropdown_link);

            // Add the Container to the Dropdown
            dropdown_links.appendChild(dropdown_link_container);

        }

        container.appendChild(nav_link);
        container.appendChild(dropdown_links);

        document.getElementById("navbarSupportedContent").appendChild(container);

    }

}

// create_navbar("VHDL Creator", "#Top");
create_navbar_from_object({text:"VHDL Creator", href:"#Top"});
