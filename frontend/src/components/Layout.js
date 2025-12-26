import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </div>
    </>
  );
}

export default Layout;
