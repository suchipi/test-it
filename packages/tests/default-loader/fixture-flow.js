// @flow
import * as React from "react";

type Props = {
  tagName: string,
};

export default class App<T> extends React.Component<Props> {
  something: number = 42;

  render() {
    const nullish = this.props ?? 5;
    const optionalChaining = this.props?.children;

    return <div />;
  }
}
