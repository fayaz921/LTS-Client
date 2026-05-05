// import { RouterProvider } from "react-router-dom";
// import { router } from "./router"; // apna correct path
// const App: React.FC = () => {
//   return <RouterProvider router={router} />;
// };
// import { RouterProvider } from "react-router-dom";
// import { router } from "./router/router"; // apna correct path

// const App: React.FC = () => {
//   return <RouterProvider router={router} />;
// };

// export default App;


import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { Loader } from './shared/components/Loader'

const App = () => {
    const isFetching = useIsFetching()
    const isMutating = useIsMutating()

    const isLoading = isFetching > 0 || isMutating > 0

    return (
        <>
            {isLoading && <Loader />}
        </>
    )
}

export default App