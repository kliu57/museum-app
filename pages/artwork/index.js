import { useState, useEffect, Error } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Pagination } from 'react-bootstrap';
import useSWR from 'swr';
import ArtworkCard from '@/components/ArtworkCard.js';
import Card from 'react-bootstrap/Card';
import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function Artwork(props) {
  const [page, setPage] = useState(1);
  const [artworkList, setArtworkList] = useState();

  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];

  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  useEffect(() => {
      if (data) {

        // filter out invalid object IDs
        let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

        let results = []

        for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
          const chunk = filteredResults.slice(i, i + PER_PAGE);
          results.push(chunk);
        }

        setArtworkList(results);
        setPage(1);
      }
  }, [data]);

  if (error) {
    return <Error statusCode={404} />;
  }

  function previousPage() {
    if (page > 1) {
      setPage(page-1);
    }
  }

  function nextPage() {
    if (page < artworkList.length) {
      setPage(page+1);
    }
  }

  if (artworkList) {
    return (
      <>
        {artworkList.length ?
          <>
            <Row className="gy-4">
              {artworkList[page-1].map((item, index) => (
                <Col lg={3} key={item}><ArtworkCard objectID={item} /></Col>
              ))}
            </Row>
            <br />
            <Row>
              <Col>
                <Pagination>
                  <Pagination.Prev onClick={previousPage} />
                  <Pagination.Item>{page}</Pagination.Item>
                  <Pagination.Next onClick={nextPage} />
                </Pagination>
              </Col>
            </Row>
          </>
          :
          <>
            <Row className="gy-4">
              <Card className="bg-light">
                <h4>Nothing Here</h4>Try searching for something else.
              </Card>
            </Row>
          </>
        }
      </>
    );
  } else {
    return null;
  }
}