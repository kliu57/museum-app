import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Error from 'next/error'

export default function ArtworkCard(props) {
    const [pageData, setPageData] = useState();
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}`);

    useEffect(() => {
        if (data) {
            setPageData(data);
        }
    }, [data]);

    if (error) {
        return <Error statusCode={404} />;
    }

    if (pageData) {
        return (
            <>
                <Card>
                    <Card.Img variant="top" src={pageData.primaryImageSmall ? pageData.primaryImageSmall : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"} />
                    <Card.Body>
                        <Card.Title>{pageData.title ? pageData.title : "N/A"}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong>{pageData.objectDate ? pageData.objectDate : "N/A"}<br />
                            <strong>Classification: </strong>{pageData.classification ? pageData.classification : "N/A"}<br />
                            <strong>Medium: </strong>{pageData.medium ? pageData.medium : "N/A"}
                            <br/>
                            <br/>
                            <Link href={`/artwork/${pageData.objectID}`} passHref legacyBehavior>
                                <Button variant="outline-primary"><strong>ID: </strong>{pageData.objectID}</Button>
                            </Link>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        );
    } else {
        return null;
    }
}