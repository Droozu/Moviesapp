import React from 'react';
// import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import 'antd/dist/antd.css';

export default class TabsList extends React.Component {


	render() {
		return (
			<Tabs className="ant-tabs"
				  defaultActiveKey="1"
				  centered
				  onTabClick={ (activeKey) => this.tabChange(activeKey) }>
				<Tabs.TabPane tab="Search" key="1" >
						hello
				</Tabs.TabPane>
				<Tabs.TabPane tab="Rated" key="2" />

			</Tabs>
		);
	}
}

// Tabs.propTypes = {
// 	children: PropTypes.
	// tabState: PropTypes.string.isRequired,
	// onTabs: PropTypes.func.isRequired,
// };
