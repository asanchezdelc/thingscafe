import React from 'react';
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
            <header>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="#home">thingsCafe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {/* <Nav.Link href="#home">Home</Nav.Link> */}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        )
    }
}

export default Header