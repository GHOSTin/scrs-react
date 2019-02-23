import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { withStyles } from '@material-ui/core/styles';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import StudentDialog from '../components/StudentDialog';
import Avatar from 'material-ui/Avatar';
import NewIcon from '@material-ui/icons/PlaylistAdd';
import AttachmentIcon from '@material-ui/icons/Attachment';
import teal from '@material-ui/core/colors/teal';
const teal400 = teal['400'];
import IconButton from '@material-ui/core/IconButton';
import ContentCreate from '@material-ui/icons/Create';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import {RolesCollection} from '../../api/roles/roles';
import {_} from 'lodash';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from 'material-ui/Snackbar';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ImportDialog from '../components/importStudentsDialog.jsx';

import {remove, archive} from '../../api/students/methods';
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import StyleIcon from '@material-ui/icons/Style';
import ExitToAppIcon from '@material-ui/icons/ExitToAppTwoTone';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";

import {
  GroupingState,
  IntegratedGrouping,
  SelectionState,
  PagingState,
  SortingState,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table as TableGrid,
  TableHeaderRow,
  TableGroupRow,
  PagingPanel,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const UserContext = React.createContext();

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'ФИО' },
  { id: 'spec', numeric: false, disablePadding: true, label: 'Специальность' },
  { id: 'year', numeric: true, disablePadding: true, label: 'Год выпуска' },
  { id: 'prof', numeric: false, disablePadding: true, label: 'Получаемая профессия' },
  { id: 'master', numeric: false, disablePadding: true, label: 'Мастер' },
  { id: 'attach', numeric: false, disablePadding: true, label: '' },
  { id: 'controls', numeric: false, disablePadding: true, label: '' },
];

class EnhancedTableHead extends BaseComponent {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              color={"primary"}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Сортировать"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.primary.main,
        backgroundColor: lighten(theme.palette.primary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
    flex: '0 0 100px'
  },
  title: {
    flex: '0 0 auto',
    width: '80%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  input: {
    'label + &': {
      marginTop: 0
    }
  },
});

let EnhancedTableToolbar = props => {
  const { value, filterList, numSelected, onArchiveClick, toggleArchive, classes, isArchive } = props;

  return (
    <UserContext.Consumer>
      {user => (
        <Toolbar
          className={classNames(classes.root, {
            [classes.highlight]: numSelected > 0,
          })}
        >
          <div className={classes.title}>
            {numSelected > 0 ? (
              <Typography color="inherit" variant="subtitle1">
                {numSelected} Выделено
              </Typography>
            ) : (
              <div className={classes.container}>
                <TextField
                  fullWidth={true}
                  name={'filter'}
                  label={"ФИО"}
                  value = {value}
                  onChange = {filterList}
                  className={classes.textField}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </div>
            )}
          </div>
          <div className={classes.spacer} />
          {Roles.userIsInRole(user, 'admin') ? (
            <div className={classes.actions}>
              {numSelected > 0 ? (
                <React.Fragment>
                  {isArchive ? (
                    <Tooltip title="Восстановить">
                      <IconButton aria-label="Repaired" onClick={onArchiveClick}>
                        <UnarchiveIcon/>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Добавить в архив">
                      <IconButton aria-label="Archived" onClick={onArchiveClick}>
                        <ArchiveIcon/>
                      </IconButton>
                    </Tooltip>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {isArchive ? (
                    <Tooltip title="Выйти из архива" placement={"bottom"}>
                      <IconButton aria-label="Exit archive" onClick={toggleArchive}>
                        <ExitToAppIcon/>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Перейти в архив" placement={"bottom"}>
                      <IconButton aria-label="Go to archive" onClick={toggleArchive}>
                        <StyleIcon/>
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Фильтр" placement={"bottom"}>
                    <IconButton aria-label="Filter list">
                      <FilterListIcon/>
                    </IconButton>
                  </Tooltip>
                </React.Fragment>
              )}
            </div>
            ) : null
          }
        </Toolbar>
      )}
    </UserContext.Consumer>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  isArchive: PropTypes.bool.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 10
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  attach: {
    button: {
      height: 30,
      lineHeight: "30px",
    },
    label: {
      fontSize: "12px"
    }
  },
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
  checkbox: {
    color: theme.palette.primary.default,
    '&$checked': {
      color: theme.palette.primary.default,
    }
  }
});

class EnchantedStudentsTable extends  BaseComponent {

  state = {
    selected: [],
    page: 0,
    rowsPerPage: 10,
    order: 'asc',
    orderBy: 'name',
  };

  handleClickRow = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: this.props.students.filter(n => !n.currentProfession?._id).map(n => n._id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleArchiveClick = () => {
    const {selected} = this.state;
    if(selected) {
      archive.call({students: selected, repair: true});
      this.setState({ selected: [] })
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleEditClick = (event, student, type) => {
    if(type === 'attach') {
      const { selected } = this.state;
      const selectedIndex = selected.indexOf(student._id);
      let newSelected = [];

      if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      this.setState({ selected: newSelected });
    }
    this.props.onEditingChange(event, student, type)
  };

  static handleRemoveClick = (event, student) => {
    event.stopPropagation();
    if(confirm("Вы действительно хотите удалить студента?")){
      remove.call({ id: student._id });
    }
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {classes, students, filter, onFilteredList, toggleArchive, isArchive} = this.props;
    const {selected, order, orderBy, rowsPerPage, page} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);

    return (
      <React.Fragment>
        <EnhancedTableToolbar
          numSelected={selected.length}
          filterList = {onFilteredList}
          value={filter}
          onArchiveClick={this.handleArchiveClick}
          toggleArchive={toggleArchive}
          isArchive={isArchive}
        />
        <div className={classes.tableWrapper}>
          <UserContext.Consumer>
          {user => (
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={students.filter(n => !n.currentProfession._id).length}
              />
              <TableBody>
                {stableSort(students, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n._id);
                    return (
                      <TableRow
                        hover
                        onClick={_.isNull(n.currentProfession._id)? event => this.handleClickRow(event, n._id):null}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n._id}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            color={"primary"}
                            disabled={!_.isNull(n.currentProfession._id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {n.name}
                        </TableCell>
                        <TableCell align="right">{n.speciality}</TableCell>
                        <TableCell align="right">{n.year}</TableCell>
                        <TableCell align="right">{n.currentProfession ? n.currentProfession.name : null}</TableCell>
                        <TableCell align="right">
                          {n.currentProfession?.master ? n.currentProfession.master.profile.name : null }
                        </TableCell>
                        <TableCell style={{width: 200}} padding={"none"}>
                          <Button
                            className={classes.margin}
                            color={"primary"}
                            size={"small"}
                            variant="contained"
                            onClick={e => this.handleEditClick(e, n, "attach")}
                            disabled={!_.isNull(n.currentProfession._id)}
                          >Прикрепить студента</Button>
                        </TableCell>
                        <TableCell style={{overflow: 'visible', width: Roles.userIsInRole(user, 'admin')?130:0}} padding={"none"}>
                          {Roles.userIsInRole(user, 'admin')?(
                            <React.Fragment>
                              <Tooltip title="Изменить">
                                <IconButton
                                  className={classes.margin}
                                  onClick={e => this.handleEditClick(e, n, "edit")}
                                >
                                  <ContentCreate fontSize="small"/>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={"Удалить"}>
                                <IconButton
                                  className={classes.margin}
                                  onClick={e => StudentsPage.handleRemoveClick(e, n)}
                                >
                                  <RemoveCircle fontSize="small"/>
                                </IconButton>
                              </Tooltip>
                            </React.Fragment>):null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            )}
          </UserContext.Consumer>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Предыдущая',
          }}
          nextIconButtonProps={{
            'aria-label': 'Следующая',
          }}
          labelRowsPerPage={"Строк на странице:"}
          labelDisplayedRows={({ from, to, count }) =>{ return `${from}-${to} из ${count}`}}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </React.Fragment>
    )
  }
}

EnchantedStudentsTable = withStyles(styles)(EnchantedStudentsTable);

const pagingPanelMessages = {
  showAll: 'Все',
  rowsPerPage: 'Строк на странице:',
  info: '{from}-{to} из {count}',
};

const cellTheme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: teal,
  },
});

const cellComponent = ({ row, selected, onToggle, children }) => {
  return (
    <MuiThemeProvider theme={cellTheme}>
      <TableSelection.Cell
        row={row}
        onToggle={onToggle}
        selected={selected}
      >
        {children}
      </TableSelection.Cell>
    </MuiThemeProvider>
  );
};

const headerCellComponent = ({ disabled, allSelected, someSelected, onToggle, children }) => {
  return (
    <MuiThemeProvider theme={cellTheme}>
      <TableSelection.HeaderCell
        disabled={disabled}
        allSelected={allSelected}
        someSelected={someSelected}
        onToggle={onToggle}
      >
        {children}
      </TableSelection.HeaderCell>
    </MuiThemeProvider>
  );
};

class EnchantedArchiveTable extends BaseComponent {

  state = {
    columns: [
      { name: 'name', title: 'ФИО' },
      { name: 'speciality', title: 'Специальность' },
      { name: 'year', title: 'Год выпуска' },
    ],
    grouping: [{ columnName: 'year' }],
    selection: [],
    pageSizes: [10, 25, 100],
  };

  handleArchiveClick = () => {
    const {selection} = this.state;
    if(selection) {
      const selected = this.props.rows.filter((n,i) => selection.includes(i)).map(n=>n._id);
      archive.call({students: selected, repair: false});
      this.setState({ selection: [] })
    }
  };

  changeSelection = selection => this.setState({ selection });

  render() {
    const { columns, grouping, selection, pageSizes } = this.state;
    const {rows, classes, isArchive, toggleArchive, onFilteredList, filter} = this.props;

    return (
      <React.Fragment>
        <EnhancedTableToolbar
          numSelected={selection.length}
          filterList = {onFilteredList}
          value={filter}
          onArchiveClick={this.handleArchiveClick}
          toggleArchive={toggleArchive}
          isArchive={isArchive}
        />
        <div className={classes.tableWrapper}>
          <Grid
            rows={rows.map((e, k) => {return {id: k, ...e}})}
            columns={columns}
          >
            <SortingState
              defaultSorting={[
                { columnName: 'year', direction: 'desc' },
                { columnName: 'name', direction: 'asc' }
                ]}
            />
            <GroupingState
              grouping={grouping}
            />
            <SelectionState
              selection={selection}
              onSelectionChange={this.changeSelection}
            />
            <PagingState
              defaultCurrentPage={0}
              defaultPageSize={10}
            />
            <IntegratedSorting />
            <IntegratedSelection />
            <IntegratedPaging />
            <IntegratedGrouping />
            <TableGrid />
            <TableHeaderRow showSortingControls/>
            <TableSelection
              showSelectAll
              cellComponent={cellComponent}
              headerCellComponent={headerCellComponent}
            />
            <TableGroupRow />
            <PagingPanel
              pageSizes={pageSizes}
              messages={pagingPanelMessages}
            />
          </Grid>
        </div>
      </React.Fragment>
    )
  }

}

EnchantedArchiveTable = withStyles(styles)(EnchantedArchiveTable);

class StudentsPage extends BaseComponent {

  state = {
    message: '',
    open: false,
    openSpeed: false,
    hidden: false,
    openMessage: false,
    openImport: false,
    students: [],
    studentsArchive: [],
    archive: false,
    filter: '',
    archiveFilter: '',
  };

  constructor(props) {
    super(props);
    this.getRole = (role) => {return _.chain(RolesCollection).find({value: role}).get('text', '').value()};
    this.state = {...this.state,  editing: undefined, type: "" };
  }

  getChildContext() {
    return {
      editing: this.state.editing,
      type: this.state.type,
      professions: this.props.professions,
      controllers: this.props.controllers,
      masters: this.props.masters,
      instructors: this.props.instructors,
    };
  }

  componentWillReceiveProps(props){
    this.setState({
      initialStudentsList: props.students,
      initialArchiveList: props.studentsArchive,
      students: props.students,
      studentsArchive: props.studentsArchive
    })
  }

  handleEditingChange = (event, student, type) => {
    event.stopPropagation();
    this.setState({
      student: _.isEmpty(student) ? undefined : student,
      open: true,
      editing: type==="edit" || type==="attach",
      type: type
    });
  };

  onHideModal = () => {
    this.setState({
      open: false,
      openImport: false
    });
  };

  onClickImport = () => {
    this.setState({
      openImport: true
    });
  };

  filterList = (event) => {
    let updatedList = this.state.initialStudentsList;
    updatedList = updatedList.filter(function(item){
      return item.name.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({students: updatedList, filter: event.target.value});
  };

  filterArchiveList = event => {
    let updatedList = this.state.initialArchiveList;
    updatedList = updatedList.filter(item =>item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1);
    this.setState({studentsArchive: updatedList, archiveFilter: event.target.value});
  };

  handleClick = () => {
    this.setState(state => ({
      openSpeed: !state.openSpeed,
    }));
  };

  handleOpen = () => {
    if (!this.state.hidden) {
      this.setState({
        openSpeed: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      openSpeed: false,
    });
  };

  handleToggleArchive = () => {
    this.setState(state=>({
      archive: !state.archive
    }));
  };

  render() {
    const { loading, listExists, classes, user } = this.props;
    const { students, hidden, openSpeed, archive, filter, archiveFilter } = this.state;

    const items = [
      {
        primaryText: i18n.__('pages.StudentsPage.importStudents'),
        rightAvatar: <Avatar backgroundColor={teal400} icon={<AttachmentIcon />} />,
        onClick: () => this.onClickImport()
      },
      {
        primaryText: i18n.__('pages.StudentsPage.addNewStudent'),
        rightAvatar: <Avatar backgroundColor={teal400} icon={<NewIcon />} />,
        onClick: (e) => this.handleEditingChange( e,{}, "create")
      },
    ];

    if (!listExists) {
      return <NotFoundPage />;
    }

    let Students;
    if (!students) {
      Students = (
          <Message
              title={i18n.__('pages.StudentsPage.noStudents')}
              subtitle={i18n.__('pages.StudentsPage.addAbove')}
          />
      );
    } else {
      Students = (
        <Paper className={classes.root}>
          {!archive ?
            <EnchantedStudentsTable
              students={students}
              filter={filter}
              onFilteredList={this.filterList}
              onEditingChange={this.handleEditingChange}
              toggleArchive={this.handleToggleArchive}
              isArchive={archive}
            />
            :<EnchantedArchiveTable
              rows={this.state.studentsArchive}
              isArchive={archive}
              filter={archiveFilter}
              toggleArchive={this.handleToggleArchive}
              onFilteredList={this.filterArchiveList}
            />
          }
        </Paper>
      );
    }

    return (
        <div className="page lists-show">
          <UserContext.Provider value={user}>
            <div className="content-scrollable list-items">
              {loading
                ? <Message title={i18n.__('pages.StudentsPage.loading')} />
                : Students}
            </div>
          </UserContext.Provider>
          {Roles.userIsInRole(user, 'admin')?
          <SpeedDial
            ariaLabel="Добавить/Импортировать"
            className={classes.speedDial}
            hidden={hidden}
            icon={<SpeedDialIcon />}
            onBlur={this.handleClose}
            onClick={this.handleClick}
            onClose={this.handleClose}
            onFocus={this.handleOpen}
            onMouseEnter={this.handleOpen}
            onMouseLeave={this.handleClose}
            open={openSpeed}
            ButtonProps={{color: "secondary"}}
          >
            {items.map(action => (
              <SpeedDialAction
                key={action.primaryText}
                icon={action.rightAvatar}
                tooltipTitle={action.primaryText}
                tooltipOpen
                onClick={action.onClick}
                ButtonProps={{color: "secondary"}}
              />
            ))}
          </SpeedDial>: null}
          {!loading ?
          <StudentDialog
            open={this.state.open}
            onHide={this.onHideModal}
            student={this.state.student}
          /> : null}
          <ImportDialog
            open={this.state.openImport}
            onHide={this.onHideModal}
          />
          <Snackbar
              open={this.state.openMessage}
              message={this.state.message}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
          />
        </div>
    );
  }
}

StudentsPage.propTypes = {
  loading: PropTypes.bool,
  listExists: PropTypes.bool,
  students: PropTypes.array,
};

StudentsPage.childContextTypes = {
  editing: PropTypes.bool,
  type: PropTypes.string,
  professions: PropTypes.array,
  controllers: PropTypes.array,
  masters: PropTypes.array,
  instructors: PropTypes.array,
};

export default withStyles(styles)(StudentsPage);