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
      <h1 style={styles.heading}>WELCOME! CREATE AN ANGO TO MATCH</h1>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '10px',
  },
  asciiArt: {
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre',
  },
  heading: {
    fontSize: '24px',
    marginTop: '20px',
  }
};

export default Header;
