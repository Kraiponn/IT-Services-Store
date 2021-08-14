import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "features/store";
import { PersistGate } from "redux-persist/es/integration/react";
import Layout from "components/shares/Layout";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Layout></Layout>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
