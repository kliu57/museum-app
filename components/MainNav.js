import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
    let router = useRouter();
    const [searchField, setSearchField] = useState();
    const [isExpanded, setIsExpanded] = useState(false);

    // get a reference to searchHistory from the searchHistoryAtom
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    let token = readToken();    // obtains payload from JWT (data digitally signed on our server ie. "_id" and "userName"

    function logout() {
        setIsExpanded(false);   // set expanded state value to false to collapse menu
        removeToken();  // removes token from localStorage
        router.push("/login"); // redirect
    }

    async function submitForm(e) {
        e.preventDefault(); // prevent the browser from automatically submitting the form
        setIsExpanded(false); // collapse navbar when user makes a search
        let queryString = `title=true&q=${searchField}`;
        if (searchField?.trim().length) {
            router.push(`/artwork?${queryString}`);     // redirect
            setSearchHistory(await addToHistory(`title=true&q=${searchField}`)); // add to search history
            setSearchField(""); // clear search field
        }
    }

    // show Advanced Search, Search form , User Name dropdown, Logout link, userName, if user is logged in
    // show Register and Login links if user is not logged in
    return (
        <>
            <Navbar expand="lg" className="fixed-top navbar-dark bg-primary" expanded={isExpanded}>
                <Container>
                <Navbar.Brand>Katie Liu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={e => setIsExpanded(!isExpanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={e => setIsExpanded(false)}>Home</Nav.Link></Link>
                        {token && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={e => setIsExpanded(false)}>Advanced Search</Nav.Link></Link>}
                    </Nav>
                    {!token && <Nav>
                        <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={e => setIsExpanded(false)}>Register</Nav.Link></Link>
                        <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={e => setIsExpanded(false)}>Log In</Nav.Link></Link>
                    </Nav>}
                    {token && '\u00A0'}
                    {token && <Form className="d-flex" id="myForm" onSubmit={submitForm}>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={e => setSearchField(e.target.value)}
                            value={searchField}
                        />
                        <Button variant="success" type="submit">Search</Button>
                    </Form>}
                    {token && '\u00A0'}
                    {token && <Nav>
                        <NavDropdown title={token.userName} id="basic-nav-dropdown">
                            <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={e => setIsExpanded(false)}>Favourites</NavDropdown.Item></Link>
                            <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={e => setIsExpanded(false)}>Search History</NavDropdown.Item></Link>
                            <NavDropdown.Item onClick={e => logout()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>}
                </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <br />
            <br />
        </>
    );
}