import React from "react";

import styles from "./index.module.less";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={styles.box}>list</div>;
  }
}

export default App;
