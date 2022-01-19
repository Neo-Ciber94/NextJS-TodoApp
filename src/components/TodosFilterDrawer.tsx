import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export interface TodoFilters {
  completed?: boolean;
  color?: string[];
  tags?: string;
}

export interface TodosFiltersProps {
  open: boolean;
  onClose: () => void;
  filters: TodoFilters;
  setFilters: (filters: TodoFilters) => void;
}

// An array of sample tags for todos
const TAGS: string[] = [
  "home",
  "work",
  "school",
  "personal",
  "travel",
  "shopping",
  "family",
  "friends",
  "important",
  "urgent",
  "fun",
  "hobby",
  "health",
  "career",
  "money",
];

export const TodosFiltersDrawer: React.FC<TodosFiltersProps> = ({
  open,
  onClose,
  filters,
  setFilters,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const setCompleted = (completed: boolean | undefined) => {
    const newFilters = { ...filters, completed };
    completed ?? delete newFilters.completed;
    setFilters(newFilters);
  };

  // @tailwind
  const pillStyle = `
    inline-flex flex-row justify-center items-center content-center 
    w-full rounded-2xl font-normal leading-6 mr-2
    px-3 py-2
    text-base
    `;

  return (
    <Drawer
      anchor={"left"}
      open={open}
      onBackdropClick={onClose}
      PaperProps={{ className: "bg-[#FED7AA] w-full md:w-1/3 sm:w-1/2" }}
    >
      <List className="pt-0 flex flex-col h-full">
        <ListItem
          onClick={onClose}
          className="bg-black cursor-pointer select-none flex flex-row"
        >
          <div className="text-white text-2xl p-2">Search Todos</div>

          <CloseOutlinedIcon className="ml-auto text-white text-3xl" />
        </ListItem>
        <div className="mt-3">
          <ListItem button onClick={() => setCompleted(undefined)}>
            <IndeterminateCheckBoxOutlinedIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="All" />
          </ListItem>
          <ListItem button onClick={() => setCompleted(false)}>
            <CheckBoxOutlineBlankOutlinedIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="Active" />
          </ListItem>
          <ListItem button onClick={() => setCompleted(true)}>
            <CheckBoxOutlinedIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="Completed" />
          </ListItem>
          <ListItem button onClick={() => {}}>
            <ColorLensIcon className="mr-3 text-[30px]" />
            <ListItemText className="p-1" primary="Color" />
          </ListItem>
        </div>
      </List>
      <Divider className="mx-2" />
      <List className="mt-auto">
        <ListItem>
          <div className="font-bold text-black text-xl">Tags</div>
        </ListItem>
        <ListItem>
          {/* <div className="flex flex-row gap-1 flex-wrap pb-5 pt-2"> */}
          <div className="grid grid-cols-3 w-full gap-1 pb-5 pt-2">
            {TAGS.map((tag, index) => (
              <button
                key={index}
                className={`${pillStyle} bg-black hover:bg-gray-800 text-white`}
              >
                {tag}
              </button>
            ))}

            <button
              className={`${pillStyle} bg-stone-700 hover:bg-stone-500 text-white`}
            >
              More...
            </button>
          </div>
        </ListItem>
      </List>
    </Drawer>
  );
};
