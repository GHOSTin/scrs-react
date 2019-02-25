import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import UserDialog from '../components/UserDialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from '@material-ui/icons/Add';
import yellow from '@material-ui/core/colors/yellow';
import common from '@material-ui/core/colors/common';
const yellow400 = yellow['400'];
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ContentCreate from '@material-ui/icons/Create';
import Status from '../components/Status';
import {RolesCollection} from '../../api/roles/roles';
import {_} from 'lodash';

import {remove} from '../../api/users/methods';
import {withStyles} from "@material-ui/styles";
import {
  Grid, PagingPanel, SearchPanel,
  Table as TableGrid,
  TableHeaderRow, Toolbar
} from "@devexpress/dx-react-grid-material-ui";
import {
  DataTypeProvider,
  IntegratedFiltering, IntegratedPaging,
  IntegratedSorting,
  PagingState, SearchState,
  SortingState
} from "@devexpress/dx-react-grid";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import {Getter, Plugin, Template} from "@devexpress/dx-react-core";
import * as PropTypes from "prop-types";


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  floatingActionButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  }
});

const pluginDependencies = [
  {name: 'Table'},
];

const ACTIONS_COLUMN_TYPE = 'actionsColumnType';
const TABLE_HEADING_TYPE = 'heading';

function tableColumnsWithActions(tableColumns, width) {
  return [...tableColumns, {key: ACTIONS_COLUMN_TYPE, type: ACTIONS_COLUMN_TYPE, width: width}];
}

function isHeadingActionsTableCell(tableRow, tableColumn) {
  return tableRow.type === TableHeaderRow.ROW_TYPE && tableColumn.type === ACTIONS_COLUMN_TYPE;
}

function isActionsTableCell(tableRow, tableColumn) {
  return tableRow.type !== TableHeaderRow.ROW_TYPE && tableColumn.type === ACTIONS_COLUMN_TYPE;

}

export class ActionsColumn extends React.PureComponent {
  render() {
    const {
      actions,
      width,
    } = this.props;
    const tableColumnsComputed = ({tableColumns}) => tableColumnsWithActions(tableColumns, width);

    return (
      <Plugin
        name="ActionsColumn"
        dependencies={pluginDependencies}
      >
        <Getter name="tableColumns" computed={tableColumnsComputed}/>

        <Template
          name="tableCell"
          predicate={({tableRow, tableColumn}) =>
            isHeadingActionsTableCell(tableRow, tableColumn)}
        >
          <TableGrid.Cell/>
        </Template>
        <Template
          name="tableCell"
          predicate={({tableRow, tableColumn}) => isActionsTableCell(tableRow, tableColumn)}
        >
          {params => (
            <TableGrid.Cell {...params} row={params.tableRow.row}>
              {actions.map(action => {
                const row = params.tableRow.row;
                return (
                  action.tooltip ? (
                    <Tooltip title={action.tooltipTitle} key={row.id}>
                      <IconButton onClick={() => action.action(row)}>
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  ) :(
                    <IconButton onClick={() => action.action(row)} key={row.id}>
                      {action.icon}
                    </IconButton>
                  )
                )
              })}
            </TableGrid.Cell>
          )}
        </Template>
      </Plugin>
    );
  }
}
ActionsColumn.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node,
    action: PropTypes.func.isRequired
  })).isRequired,
  width: PropTypes.number
};
ActionsColumn.defaultProps = {
  width: 100,
};


const pagingPanelMessages = {
  showAll: 'Все',
  rowsPerPage: 'Строк на странице:',
  info: '{from}-{to} из {count}',
};

const tableHeaderMessages = {
  sortingHint: 'Сортировать'
};

const searchPanelMessages = {
  searchPlaceholder: 'Поиск...'
};

const filterRowMessages = {
  filterPlaceholder: 'Фильтровать по полю',
  contains: 'Содержит',
  notContains: 'Не содержит',
  startsWith: 'Начинается с',
  endsWith: 'Заканчиается на',
  equal: 'Равно',
  notEqual: 'Не равно',
  greaterThan: 'Больше',
  greaterThanOrEqual: 'Больше или равно',
  lessThan: 'Меньше',
  lessThanOrEqual: 'Меньше или равно',
  empty: 'Пусто'
};

const avatarFormatter = withStyles(styles)(
  ({ value, classes }) =>
    <Avatar src={value} />
);

const statusFormatter = withStyles(styles)(
  ({ value, classes }) =>
    <Status status={value} />
);

class EnchantedTable extends BaseComponent {

  state = {
    columns: [
      { name: 'avatar', title: ' ', getCellValue: row => row.avatar },
      { name: 'name', title: 'ФИО', getCellValue: row => row.profile?.name },
      { name: 'username', title: 'Логин' },
      { name: 'roles', title: 'Роли доступа', getCellValue: row => this.getRole(row.roles[0]) },
      {
        name: 'status',
        title: 'Статус',
        getCellValue: row => row.profile?.status
      },
    ],
    searchValue: '',
    pageSizes: [25, 50, 100],
    tableColumnExtensions: [
      { columnName: 'avatar', width: 68 },
      { columnName: 'status', width: 150 },
      { columnName: 'controls', width: 100 },
    ],
  };

  changeSorting = sorting => this.setState({ sorting });

  changeSearchValue = value => this.setState({ searchValue: value });

  getRole = (role) => {return _.chain(RolesCollection).find({value: role}).get('text', '').value()};


  render() {
    const {
      columns,
      pageSizes,
      searchValue,
      tableColumnExtensions,
    } = this.state;
    const {rows, classes, handleChange} = this.props;

    const actions = [
      {
        icon: <ContentCreate/>,
        action: row => handleChange(row, true),
        tooltip: true,
        tooltipTitle: 'Изменить'
      }
    ];

    return (
        <div className={classes.tableWrapper}>
          <Grid
            rows={rows.map((e, k) => {return {id: k, ...e}})}
            columns={columns}
          >
            <DataTypeProvider
              for={['avatar']}
              formatterComponent={avatarFormatter}
            />
            <DataTypeProvider
              for={['status']}
              formatterComponent={statusFormatter}
            />
            <SortingState
              defaultSorting={[
                { columnName: 'name', direction: 'asc' }
              ]}
              onSortingChange={this.changeSorting}
            />
            <PagingState
              defaultCurrentPage={0}
              pageSize={25}
            />
            <IntegratedSorting />
            <IntegratedPaging />
            <SearchState
              value={searchValue}
              onValueChange={this.changeSearchValue}
            />
            <IntegratedFiltering />
            <TableGrid
              columnExtensions={tableColumnExtensions}
            />
            <TableHeaderRow
              showSortingControls
              messages={tableHeaderMessages}
            />
            <ActionsColumn actions={actions}/>
            <Toolbar />
            <SearchPanel
              messages={searchPanelMessages}
            />
            <PagingPanel
              pageSizes={pageSizes}
              messages={pagingPanelMessages}
            />
          </Grid>
        </div>
    )
  }

}

EnchantedTable = withStyles(styles)(EnchantedTable);

class UsersPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {...this.state,  editing: undefined, open: false };
  }

  getChildContext() {
    return {editing: this.state.editing};
  }

  handleChange = (user, editing) => {
    this.setState({
      user: editing ? user : undefined,
      open: true,
      editing: editing
    });
  };

  static onClickRemove(user){
    if(confirm(i18n.__('pages.UsersPage.confirmDelete'))){
      remove.call({ id: user._id });
    }
  }

  onHideModal = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { loading, listExists, users, classes } = this.props;

    if (!listExists || !Roles.userIsInRole(Meteor.user(), 'admin')) {
      return <NotFoundPage />;
    }

    let Users;
    if (!users || !users.length) {
      Users = (
          <Message
              title={i18n.__('pages.InternsPage.noInterns')}
              subtitle={i18n.__('pages.InternsPage.addAbove')}
          />
      );
    } else {
      Users = (
        <Paper className={classes.root}>
          <EnchantedTable rows={users} handleChange={this.handleChange}/>
        </Paper>
      );
    }

    return (
        <div className="page lists-show">
          <div className="content-scrollable list-items">
            {loading
              ? <Message title={i18n.__('pages.UsersPage.loading')} />
              : Users}
          </div>
          <FloatingActionButton
            backgroundColor={yellow400}
            onClick={() => this.handleChange({}, false)}
            className={classes.floatingActionButton}
            iconStyle={{fill: common.black}}
          >
            <ContentAdd/>
          </FloatingActionButton>
          {!loading ?
          <UserDialog
            open={this.state.open}
            onHide={this.onHideModal}
            user={this.state.user}
          /> : null}
        </div>
    );
  }
}

UsersPage.propTypes = {
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
  users: React.PropTypes.array,
};

UsersPage.childContextTypes = {
  editing: React.PropTypes.bool
};

export default withStyles(styles)(UsersPage);