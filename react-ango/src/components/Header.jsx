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
      <h2 style={styles.subheading}>solve, match, & create with ANGO!</h2>
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
  subheading: {
    fontSize: '18px',
    marginTop: '10px',
    fontFamily: 'Courier New, monospace',
  }
};

export default Header;
