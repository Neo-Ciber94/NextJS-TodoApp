import { withRestApi } from "@lib/core/withRestApi";
import { TodoPaginationOptions, TodoRepository } from "@lib/repositories/todo.repository";
import { buildPaginationOptions } from "@lib/repositories/utils";
import { Validate } from "@lib/utils/validate";
import { ITodo } from "src/shared/todo.model";

export default withRestApi(new TodoRepository(), {
  route: "/todos",
  getAll: (repo, req) => {
    const options = buildPaginationOptions<ITodo>(req) as TodoPaginationOptions;

    if (req.query.search) {
      options.search = String(req.query.search);
    }

    return repo.search(options);
  },
  update: async (repo, req) => {
    const { title, content, completed } = req.body;

    if (completed) {
      Validate.isBoolean(completed);
    }

    if (title) {
      Validate.isNonBlankString(title);
    }

    if (content) {
      Validate.isNonBlankString(content);
    }

    const id = req.params.id;
    return repo.update(id, { title, content, completed });
  },
});
