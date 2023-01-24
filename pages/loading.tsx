import { Box, Skeleton } from "@chakra-ui/react";

const Loading = () => (
  <Box m={4} bg="white" p={4} borderRadius={4}>
    <Skeleton height="45px" my={4} />
    <div
      style={{
        height: "75vh",
        overflowX: "scroll",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        columnGap: 10,
        rowGap: 5,
      }}
    >
      {new Array(100).fill(undefined).map((p, k) => (
        <Skeleton key={k} height="30px" w="45vw" />
      ))}
    </div>
  </Box>
);

export default Loading;
