import {
  Button,
  FormControl,
  TextField,
  CircularProgress,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  content?: string;
};

export interface TodoFormProps {
  initialValue?: FormData;
  buttonText: string;
  onSubmit: (data: FormData) => void;
}

const StyledTextField = styled(TextField)({
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

export function TodoForm({
  onSubmit,
  buttonText,
  initialValue,
}: TodoFormProps) {
  const {
    register,
    formState: { errors, isSubmitting, isSubmitted },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: initialValue,
  });

  const showLoading = isSubmitting || isSubmitted;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col sm:px-40 px-0"
    >
      <FormControl
        variant="standard"
        className="mt-8 mb-2 translate-x-[-180%] animate-slide-left"
      >
        <StyledTextField
          label="Title"
          variant="standard"
          {...register("title", { required: true })}
          error={!!errors.title}
          helperText={errors.title && "Title is required"}
        />
      </FormControl>

      <FormControl
        variant="standard"
        className="mt-8 mb-2 translate-x-[-220%] animate-slide-left"
      >
        <StyledTextField
          label="Content"
          variant="outlined"
          multiline
          minRows={4}
          maxRows={8}
          {...register("content")}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        className="flex flex-row justify-center text-white bg-black hover:bg-gray-800 mt-2 translate-x-[-260%] animate-slide-left"
      >
        {buttonText}
        {showLoading && <CircularProgress className="text-white mx-4" size={20} />}
      </Button>
    </form>
  );
}