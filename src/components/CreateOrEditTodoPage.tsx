import { TodoForm } from "src/components/TodoForm";
import { Button, Chip, Container, IconButton } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import PaletteIcon from "@mui/icons-material/Palette";
import React, { useState } from "react";
import { ITodo, ITodoInput } from "@shared/models/todo.model";
import { useSpring, animated } from "react-spring";
import { animations } from "src/animations/springs";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ModalMinHeight from "./TagsModal";
import { ITagInput } from "@shared/models/tag.model";

export interface CreateOrEditTodoPageProps {
  todo?: ITodo;
  onSubmit: (todo: ITodoInput) => void | Promise<void>;
  title: string;
  submitText: string;
  cache?: boolean;
}

export function CreateOrEditTodoPage({
  cache,
  todo,
  onSubmit,
  title: pageTitleText,
  submitText: submitButtonText,
}: CreateOrEditTodoPageProps) {
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const backButtonSpring = useSpring(animations.slideLeftFadeIn(0));
  const titleSpring = useSpring(animations.slideLeftFadeIn(100));
  const tagsSpring = useSpring(animations.slideLeftFadeIn(500));
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tags, setTags] = useState<ITagInput[]>(todo?.tags || []);

  const handleSelectTags = (tags: ITagInput[]) => {
    setTags(tags);
  };

  const handleSubmit = async (todo: ITodoInput) => {
    todo.tags = tags;
    await onSubmit(todo);
  };

  return (
    <>
      <Container className="pt-4">
        <div className="md:px-30 sm:px-20 px-0 flex flex-row justify-between">
          <animated.div style={backButtonSpring}>
            <Link href="/" passHref>
              <Button
                variant="contained"
                className={`bg-black hover:bg-gray-800`}
              >
                <ArrowBackIcon />
                Back
              </Button>
            </Link>
          </animated.div>

          <div>
            <IconButton title="Add tags" onClick={() => setTagsOpen(true)}>
              <LocalOfferIcon sx={{ color: "black" }} />
            </IconButton>

            <IconButton
              title="Change Color"
              onClick={() => {
                setOpenColorPicker(true);
              }}
            >
              <PaletteIcon sx={{ color: "black" }} />
            </IconButton>
          </div>
        </div>

        <animated.div style={titleSpring}>
          <PageTitle title={pageTitleText} center />
        </animated.div>

        <TodoForm
          useCache
          initialValue={todo}
          buttonText={submitButtonText}
          openColorPicker={openColorPicker}
          onCloseColorPicker={() => setOpenColorPicker(false)}
          onSubmit={handleSubmit}
        />

        <animated.div style={tagsSpring}>
          <div className="md:px-30 sm:px-20 px-0 flex flex-row flex-wrap mt-8 gap-2">
            {tags.map((tag) => (
              <Chip
                sx={{
                  color: "black",
                  backgroundColor: "transparent",
                  border: "3px solid black",
                  fontWeight: 600,
                  boxShadow: 2,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
                key={tag.id}
                label={tag.name}
                onClick={() => setTagsOpen(true)}
              />
            ))}
          </div>
        </animated.div>
      </Container>

      <ModalMinHeight
        todo={todo}
        open={tagsOpen}
        setOpen={setTagsOpen}
        onSelectTags={handleSelectTags}
      />
    </>
  );
}
