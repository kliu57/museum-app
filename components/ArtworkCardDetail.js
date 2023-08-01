import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Error from 'next/error'
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function ArtworkCardDetail(props) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    // update showAdded using useEffect hook
    useEffect(() => {
        setShowAdded(favouritesList?.includes(props.objectID))
        }, [favouritesList]
    );

    const [pageData, setPageData] = useState();
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null);

    // invoked when button is clicked
    async function favouritesClicked() {
        if (showAdded) {
            // if showAdded is true (it is in favourites), remove objectID from favouritesList
            setFavouritesList(await removeFromFavourites(props.objectID));
            setShowAdded(false);    // set showAdded to false since artwork no longer in favouritesList
        } else {
            // if showAdded is false (it is not in favourites), add objectID to favouritesList
            setFavouritesList(await addToFavourites(props.objectID))
            setShowAdded(true);     // set showAdded to true since artwork is now in favouritesList
        }
    }

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
                    {pageData.primaryImage ? <><Card.Img variant="top" src={pageData.primaryImage} /></> : <></>}
                    <Card.Body>
                        <Card.Title>{pageData.title ? pageData.title : "N/A"}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong>{pageData.objectDate ? pageData.objectDate : "N/A"}<br />
                            <strong>Classification: </strong>{pageData.classification ? pageData.classification : "N/A"}<br />
                            <strong>Medium: </strong>{pageData.medium ? pageData.medium : "N/A"}<br /><br />

                            <strong>Artist: </strong>
                            {pageData.artistDisplayName ?
                            <>
                                {pageData.artistDisplayName}
                                {pageData.artistWikidata_URL ? <>  ( <a href={pageData.artistWikidata_URL} target="_blank" rel="noreferrer">wiki</a> )</> : <></>}
                            </> : "N/A"}
                            <br />
                            
                            <strong>Credit Line: </strong>{pageData.creditLine ? pageData.creditLine : "N/A"}<br />
                            <strong>Dimensions: </strong>{pageData.dimensions ? pageData.dimensions : "N/A"}<br /><br />
                            <Button variant = {showAdded ? 'primary' : 'outline-primary'} type="button" onClick={favouritesClicked}>{showAdded ? "+ Favourite ( added )" : "+ Favourite"}</Button><br />
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        );
    } else {
        return null;
    }
}