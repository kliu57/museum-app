import { Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import styles from '@/styles/History.module.css';
import { removeFromHistory } from '@/lib/userData';

export default function History() {
    // get a reference to searchHistory from the searchHistoryAtom
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    // do not show "Nothing Here" message while history is being pulled
    if(!searchHistory) return null;

    let router = useRouter();

    // loop through searchHistory to get list of parsed search queries
    let parsedHistory = [];
    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    // cause user to navigate to the page /artwork?searchHistory[index]
    function historyClicked(e, index) {
      let queryString = searchHistory[index]; // get query string from searchHistory array
      router.push(`/artwork?${queryString}`); // redirect using useRouter hook
    }

    // remove an element from searchHistory
    async function removeHistoryClicked(e, index) {
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]));  // remove from searchHistory
    }

    // render parsedHistory
    if (parsedHistory) {
        return (
          <>
            {parsedHistory.length ?
              <>
                <ListGroup>
                    {parsedHistory.map((historyItem, index) => (
                        <ListGroup.Item key={historyItem} onClick={e => historyClicked(e, index)} className={styles.historyListItem}>
                            {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
                            <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
              </>
              :
              <>
                <Card>
                  <Card.Body>
                    <h4>Nothing Here</h4>Try searching for some artwork.
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