import "../styles/globals.css";
// import Upreach, { TimeUnit } from "../../lib/upreach";
import store from "../redux/store";
import { Provider } from "react-redux";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

// export default wrapper.withRedux(App);
export default App;
