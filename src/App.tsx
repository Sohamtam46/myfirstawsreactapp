import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();  

function App() {
  const { user, signOut } = useAuthenticator();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Array<Schema["SearchableItem"]["type"]>>([]);
  const [filteredItems, setFilteredItems] = useState<Array<Schema["SearchableItem"]["type"]>>([]);

  useEffect(() => {
    client.models.SearchableItem.observeQuery().subscribe({
      next: (data) => {
        setItems([...data.items]);
        setFilteredItems([...data.items]);
      },
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(item => 
        (item.title?.toLowerCase().includes(query) ?? false) ||
        (item.description?.toLowerCase().includes(query) ?? false) ||
        (item.category?.toLowerCase().includes(query) ?? false)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Search App</h1>
        <button onClick={signOut}>Sign out</button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '12px',
            width: '100%',
            borderRadius: '8px',
            border: '2px solid #e0e0e0',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
        />
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            style={{
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{item.title}</h3>
            {item.description && (
              <p style={{ color: '#666', margin: '0 0 10px 0' }}>{item.description}</p>
            )}
            {item.category && (
              <span style={{
                display: 'inline-block',
                padding: '4px 8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
              }}>
                {item.category}
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
