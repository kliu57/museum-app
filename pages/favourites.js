import { Row, Col } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import ArtworkCard from '@/components/ArtworkCard.js';

export default function Favourites() {
    // get a reference to the favouritesList from the favourtiesAtom
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    // do not show "Nothing Here" message while favourites are being pulled
    if(!favouritesList) return null;

    // render all items in favouritesList - show an ArtworkCard component for each item
    if (favouritesList) {
        return (
          <>
            {favouritesList.length ?
              <>
                <Row className="gy-4">
                  {favouritesList.map((item, index) => (
                    <Col lg={3} key={item}><ArtworkCard objectID={item} /></Col>
                  ))}
                </Row>
              </>
              :
              <>
                <Card>
                  <Card.Body>
                    <h4>Nothing Here</h4>Try adding some new artwork to the list.
                  </Card.Body>
                </Card>
              </>
            }
          </>
        );
    } else {
        return null;
    }
}