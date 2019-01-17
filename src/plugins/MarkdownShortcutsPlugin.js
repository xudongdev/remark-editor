import isHotkey from "is-hotkey";

class MarkdownShortcutsPlugin {
  onKeyDown(event, editor, next) {
    if (isHotkey("space", event)) {
      this.onSpace(event, editor, next);
    } else if (isHotkey("backspace", event)) {
      this.onBackspace(event, editor, next);
    } else if (isHotkey("enter", event)) {
      this.onEnter(event, editor, next);
    } else if (isHotkey("shift+enter", event)) {
      this.onShiftEnter(event, editor, next);
    } else {
      next();
    }
  }

  onSpace(event, editor, next) {
    const { value } = editor;
    const { isExpanded, selection, startBlock } = value;

    if (!isExpanded) {
      const blockProp = this.getBlockProp(
        startBlock.text.slice(0, selection.start.offset).replace(/\s*/g, "")
      );
      if (blockProp) {
        event.preventDefault();
        editor
          .withoutMerging(() => {
            editor.moveStartToStartOfBlock(startBlock).delete();
          })
          .setBlocks(blockProp);
        return;
      }
    }

    next();
  }

  onBackspace(event, editor, next) {
    const { value } = editor;
    const { isExpanded, document, selection, startBlock } = value;
    const parentBlock = document.getParent(startBlock.key);

    if (!isExpanded) {
      if (selection.start.offset === 0) {
        if (
          parentBlock.type === "blockquote" &&
          startBlock.key === parentBlock.nodes.first().key
        ) {
          console.log("[backspace] [blockquote] [clear format]");
          event.preventDefault();
          editor.splitBlock(2);
          editor.unwrapBlock(parentBlock.type);
          editor.removeNodeByKey(parentBlock.key);
          return;
        }

        if (parentBlock.type === "listItem") {
          const listBlock = document.getParent(parentBlock.key);
          if (parentBlock.key === listBlock.nodes.first().key) {
            console.log("[backspace] [list] [clear format]");
            event.preventDefault();
            editor.splitBlock(3);
            editor.unwrapBlock(parentBlock.type);
            editor.removeNodeByKey(listBlock.key);
            return;
          }

          if (startBlock.text.length === 0) {
            console.log("[backspace] [listItem] [clear format]");
            event.preventDefault();
            editor.removeNodeByKey(parentBlock.key);
            return;
          }
        }

        if (startBlock.type !== "paragraph") {
          console.log("[backspace] [other] [clear format]");
          event.preventDefault();
          editor.setBlocks("paragraph");
          return;
        }
      }
    }

    console.log("[backspace] [default]");
    next();
  }

  onEnter(event, editor, next) {
    const { value } = editor;
    const { document, startBlock, endBlock } = value;
    const parentBlock = document.getParent(startBlock.key);

    if (startBlock.key === endBlock.key) {
      if (parentBlock.type === "blockquote") {
        if (startBlock.text.length === 0) {
          console.log("[enter] [blockquote] [null line]");
          event.preventDefault();
          editor.splitBlock(2);
          editor.unwrapBlock(parentBlock.type);
          editor.removeNodeByKey(startBlock.key);
          return;
        }
      }

      if (parentBlock.type === "listItem") {
        if (startBlock.text.length === 0) {
          console.log("[enter] [listItem] [null line]");
          event.preventDefault();
          editor.splitBlock(3);
          editor.unwrapBlock(parentBlock.type);
          editor.removeNodeByKey(parentBlock.key);
          return;
        } else {
          console.log("[enter] [listItem] [default]");
          event.preventDefault();
          editor.splitBlock(2);
          return;
        }
      }

      console.log("[enter] [other] [splitBlock paragraph]");
      event.preventDefault();
      editor.splitBlock().setBlocks("paragraph");
      return;
    }

    console.log("[enter] [null]");
    event.preventDefault();
  }

  onShiftEnter(event, editor, next) {
    const { value } = editor;
    const { isExpanded, startBlock } = value;

    if (!isExpanded) {
      if (startBlock.type === "paragraph") {
        console.log("[shift + enter] [paragraph] [insert break]");
        event.preventDefault();
        editor.insertInline("break").moveForward();
        return;
      }
    }

    console.log("[shift + enter] [null]");
    event.preventDefault();
  }

  getBlockProp(chars) {
    switch (chars) {
      case "1.":
        return {
          type: "list",
          data: { ordered: true, start: null, spread: false }
        };
      case "*":
      case "-":
      case "+":
        return {
          type: "list",
          data: { ordered: false, start: null, spread: false }
        };
      case ">":
        return { type: "blockquote" };
      case "#":
        return { type: "heading", data: { depth: 1 } };
      case "##":
        return { type: "heading", data: { depth: 2 } };
      case "###":
        return { type: "heading", data: { depth: 3 } };
      case "####":
        return { type: "heading", data: { depth: 4 } };
      case "#####":
        return { type: "heading", data: { depth: 5 } };
      case "######":
        return { type: "heading", data: { depth: 6 } };
      default:
        return null;
    }
  }
}

export default function() {
  const markdownShortcutsPlugin = new MarkdownShortcutsPlugin();

  return {
    onKeyDown(event, editor, next) {
      return markdownShortcutsPlugin.onKeyDown(event, editor, next);
    }
  };
}
