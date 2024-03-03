import "@arco-design/web-react/dist/css/arco.css";
import "../styles/globals.sass";
import GraphContainer from "../hooks/use-graph-state";
import {
  CurrentPaneCtxProvider,
  FormBuilderCtxProvider,
  ApplicationsCtxProvider,
  QueryBuilderCtxProvider,
} from "../providers";

function MyApp({ Component, pageProps }) {
  return (
    <GraphContainer.Provider>
      <ApplicationsCtxProvider>
        <CurrentPaneCtxProvider>
          <FormBuilderCtxProvider>
            <QueryBuilderCtxProvider>
              <Component {...pageProps} />
            </QueryBuilderCtxProvider>
          </FormBuilderCtxProvider>
        </CurrentPaneCtxProvider>
      </ApplicationsCtxProvider>
    </GraphContainer.Provider>
  );
}

export default MyApp;
