import React from 'react';

function Header() {
  return (
    <div style={styles.container}>
      <pre style={styles.asciiArt}>
        {`
 █████╗ ███╗   ██╗ ██████╗  ██████╗ 
██╔══██╗████╗  ██║██╔════╝ ██╔═══██╗
███████║██╔██╗ ██║██║  ███╗██║   ██║
██╔══██║██║╚██╗██║██║   ██║██║   ██║
██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝
╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ 
                                    
 ██████╗  █████╗ ███╗   ██╗ ██████╗ 
██╔════╝ ██╔══██╗████╗  ██║██╔═══██╗
██║  ███╗███████║██╔██╗ ██║██║   ██║
██║   ██║██╔══██║██║╚██╗██║██║   ██║
╚██████╔╝██║  ██║██║ ╚████║╚██████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
        `}
      </pre>
      <h2 style={styles.subheading}>Solve, match, & create with ANGO!</h2>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  asciiArt: {
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre',
    color: '#4285F4',
    margin: '0',
  },
  subheading: {
    fontSize: '32px',
    marginTop: '10px',
    fontFamily: 'Lato, sans-serif',
    fontWeight: 100, 
    color: '#333',
  }
};

export default Header;
