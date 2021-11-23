import { InferGetServerSidePropsType } from "next";
import Masonry from "@mui/lab/Masonry";
import TodoNote from "src/components/TodoNote";
import { Container, Box, CircularProgress, TextField } from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { styled } from "@mui/material/styles";
import { TodoApiClient } from "src/client/api/todos.client";
import { useDebounce } from "src/hooks/useDebounce";

const todoClient = new TodoApiClient();
const HEIGHTS = [200, 300, 400, 200, 500, 200, 190, 200, 400, 200, 300];

export const getServerSideProps = async () => {
  const pageResult = await todoClient.getAll();
  return { props: { pageResult } };
};

const StyledTextField = styled(TextField)({
  width: "50%",
  "& label.Mui-focused": {
    color: "gray",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "gray",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

function Page({
  pageResult,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, currentPage, totalPages } = pageResult;
  const hasMoreItems = currentPage < totalPages;

  const [todos, setTodos] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchString = useDebounce(searchTerm, 500);
  const [isMoreLoading, setIsMoreLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const firstRender = React.useRef(true);

  useEffect(() => {
    // Avoid make other request on first render
    if (firstRender.current === true) {
      firstRender.current = false;
      return;
    }

    setIsLoading(true);
    const searchTodos = async () => {
      try {
        const result = await todoClient.search({ search: searchString });
        setTodos(result.data);
        
      } finally {
        setIsLoading(false);
      }
    };

    //
    searchTodos();
  }, [searchString]);

  return (
    <div className="bg-orange-100">
      <Container sx={{ padding: 5, paddingBottom: 10 }}>
        <div className="flex flex-row justify-center">
          <h1 className="font-mono text-5xl">Todos</h1>
        </div>
        <div className="flex flex-row justify-center p-3 mb-4">
          <SearchTextField
            key={"search-input"}
            value={searchTerm}
            onSearch={setSearchTerm}
          />
        </div>
        {isLoading && <CircularProgress />}
        <Masonry columns={[1, 2, 3, 4]} spacing={2}>
          {todos.map((todo, index) => (
            <TodoNote
              key={todo.id}
              delayIndex={index % 10}
              todo={todo}
              height={HEIGHTS[index % todos.length]}
            />
          ))}
        </Masonry>
        <ViewInterceptor
          inView={async (inView) => {
            if (inView) {
              console.log("In View");
              if (hasMoreItems && !isMoreLoading) {
                setIsMoreLoading(true);
                try {
                  const newTodos = await todoClient.getAll({ page: page + 1 });
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  setTodos([...todos, ...newTodos.data]);
                  setPage(newTodos.currentPage);
                } finally {
                  setIsMoreLoading(false);
                }
              }
            }
          }}
        />
        {isMoreLoading && (
          <Box className="flex flex-row justify-center p-3">
            <CircularProgress color="primary" />
          </Box>
        )}
      </Container>
    </div>
  );
}

interface SearchTextFieldProps {
  value: string;
  onSearch: (term: string) => void;
}

function SearchTextField({ value, onSearch }: SearchTextFieldProps) {
  return (
    <StyledTextField
      label="Search"
      variant="standard"
      value={value}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onSearch(value);
        }
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
      }}
    />
  );
}

interface InterceptorProps {
  inView: (inView: boolean) => void;
}

const ViewInterceptor: React.FC<InterceptorProps> = (props) => {
  const { ref, inView } = useInView();
  const [wasInView, setWasInView] = React.useState(inView);

  useEffect(() => {
    if (inView != wasInView) {
      props.inView(inView);
      setWasInView(inView);
    }
  }, [props, inView, wasInView]);

  return <div ref={ref}></div>;
};

export default Page;
