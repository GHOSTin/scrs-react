import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import ResultItem from '../components/ResultItem.jsx';
import Paper from "@material-ui/core/Paper";
import {
  Grid, PagingPanel,
  Table as TableGrid, TableFilterRow,
  TableGroupRow,
  TableHeaderRow, TableRowDetail,
  TableSelection
} from "@devexpress/dx-react-grid-material-ui";
import {
  DataTypeProvider,
  FilteringState,
  GroupingState, IntegratedFiltering, IntegratedGrouping, IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState, RowDetailState,
  SelectionState,
  SortingState
} from "@devexpress/dx-react-grid";
import {withStyles} from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import teal from "@material-ui/core/colors/teal";
import SpaceBar from '@material-ui/icons/SpaceBar';
import {lighten} from "@material-ui/core/styles/colorManipulator";
import Toolbar from "@material-ui/core/Toolbar";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Icon from "@material-ui/core/Icon";
import {Getter} from "@devexpress/dx-react-core";
import {_} from "lodash";
import Workbook from 'react-xlsx-workbook'
import Moment from "moment";

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
    flex: '0 0 auto'
  },
  title: {
    flex: '0 0 auto',
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
  detailContainer: {
    margin: '20px',
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
  },
});

class Download extends React.PureComponent {
  
  render() {
    const {data, classes} = this.props;
    return (
      <Workbook element={
        <Tooltip title="Сохранить Excel">
          <IconButton aria-label="Save excel">
            <Icon className={classNames(classes.icon, 'far fa-file-excel')} />
          </IconButton>
        </Tooltip>
      }>
        <Workbook.Sheet data={data} name="Отчет">
          <Workbook.Column label="ФИО" value="name"/>
          <Workbook.Column label="Специальность" value="speciality"/>
          <Workbook.Column label="Год выпуска" value="year"/>
          <Workbook.Column label="Профессия 1" value="profession_0"/>
          <Workbook.Column label="Наставник" value="controller_0"/>
          <Workbook.Column label="Мастер" value="master_0"/>
          <Workbook.Column label="Инструктор" value="instructor_0"/>
          <Workbook.Column label="Оценка 1" value={row => row['points_0'][0]}/>
          <Workbook.Column label="Оценка 2" value={row => row['points_0'][1]}/>
          <Workbook.Column label="Оценка 3" value={row => row['points_0'][2]}/>
          <Workbook.Column label="Оценка 4" value={row => row['points_0'][3]}/>
          <Workbook.Column label="Оценка 5" value={row => row['points_0'][4]}/>
          <Workbook.Column label="Профессия 2" value="profession_1"/>
          <Workbook.Column label="Наставник" value="controller_1"/>
          <Workbook.Column label="Мастер" value="master_1"/>
          <Workbook.Column label="Инструктор" value="instructor_1"/>
          <Workbook.Column label="Оценка 1" value={row => row['points_1']?row['points_1'][0]:null}/>
          <Workbook.Column label="Оценка 3" value={row => row['points_1']?row['points_1'][2]:null}/>
          <Workbook.Column label="Оценка 2" value={row => row['points_1']?row['points_1'][1]:null}/>
          <Workbook.Column label="Оценка 4" value={row => row['points_1']?row['points_1'][3]:null}/>
          <Workbook.Column label="Оценка 5" value={row => row['points_1']?row['points_1'][4]:null}/>
          <Workbook.Column label="Профессия 3" value="profession_2"/>
          <Workbook.Column label="Наставник" value="controller_2"/>
          <Workbook.Column label="Мастер" value="master_2"/>
          <Workbook.Column label="Инструктор" value="instructor_2"/>
          <Workbook.Column label="Оценка 1" value={row => row['points_2']?row['points_2'][0]:null}/>
          <Workbook.Column label="Оценка 2" value={row => row['points_2']?row['points_2'][1]:null}/>
          <Workbook.Column label="Оценка 3" value={row => row['points_2']?row['points_2'][2]:null}/>
          <Workbook.Column label="Оценка 4" value={row => row['points_2']?row['points_2'][3]:null}/>
          <Workbook.Column label="Оценка 5" value={row => row['points_2']?row['points_2'][4]:null}/>
          <Workbook.Column label="Профессия 4" value="profession_3"/>
          <Workbook.Column label="Наставник" value="controller_3"/>
          <Workbook.Column label="Мастер" value="master_3"/>
          <Workbook.Column label="Инструктор" value="instructor_3"/>
          <Workbook.Column label="Оценка 1" value={row => row['points_3']?row['points_3'][0]:null}/>
          <Workbook.Column label="Оценка 2" value={row => row['points_3']?row['points_3'][1]:null}/>
          <Workbook.Column label="Оценка 3" value={row => row['points_3']?row['points_3'][2]:null}/>
          <Workbook.Column label="Оценка 4" value={row => row['points_3']?row['points_3'][3]:null}/>
          <Workbook.Column label="Оценка 5" value={row => row['points_3']?row['points_3'][4]:null}/>
          <Workbook.Column label="Профессия 5" value="profession_4"/>
          <Workbook.Column label="Наставник" value="controller_4"/>
          <Workbook.Column label="Мастер" value="master_4"/>
          <Workbook.Column label="Инструктор" value="instructor_4"/>
          <Workbook.Column label="Оценка 1" value={row => row['points_4']?row['points_4'][0]:null}/>
          <Workbook.Column label="Оценка 2" value={row => row['points_4']?row['points_4'][1]:null}/>
          <Workbook.Column label="Оценка 3" value={row => row['points_4']?row['points_4'][2]:null}/>
          <Workbook.Column label="Оценка 4" value={row => row['points_4']?row['points_4'][3]:null}/>
          <Workbook.Column label="Оценка 5" value={row => row['points_4']?row['points_4'][4]:null}/>
        </Workbook.Sheet>
      </Workbook>
    );
  }
}

Download = withStyles(styles)(Download);

let EnhancedTableToolbar = props => {
  const { numSelected, classes, checked, handleChange, exportData } = props;

  return (
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
          null
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Download data={exportData}/>
          ) : (null
        )}
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              value="checked"
            />
          }
          label="В том числе архив"
          labelPlacement={"start"}
        />
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const gridTheme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: teal,
  },
  typography: {
    useNextVariants: true,
  },
});

const pagingPanelMessages = {
  showAll: 'Все',
  rowsPerPage: 'Строк на странице:',
  info: '{from}-{to} из {count}',
};

const tableHeaderMessages = {
  sortingHint: 'Сортировать'
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

const getAvgPoints = (journal) => {
  return _.chain(journal)
    .map(function (e) {
      return e.points
    })
    .unzip()
    .map((e) => {
      return _.chain(e).meanBy(function (o) {
        return parseInt(o)
      }).floor(2).value()
    })
    .value();
};

const getColor = (amount: number) : string => {
  if (amount > 3) {
    return '#F44336';
  }
  if (amount > 2) {
    return '#ffc107';
  }
  return '#009688';
};

const FilterIcon = ({ type, ...restProps }) => {
  if (type === 'empty') return <SpaceBar {...restProps} />;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};

const GridDetailContainerBase = ({row, classes}) => {
  return (
    <div className={classes.detailContainer}>
      <ResultItem student={row}/>
    </div>
  )
};

const GridDetailContainer = withStyles(styles)(GridDetailContainerBase);

const weeksFormatter = withStyles(styles)(
  ({value, classes}) =>
    <b className={classes.weeks} style={{ color: getColor(value) }}>{value}</b>
);

class EnchantedTable extends BaseComponent {

  state = {
    exportRawData: [],
    exportData: [],
    columns: [
      { name: 'name', title: 'ФИО' },
      { name: 'speciality', title: 'Специальность' },
      { name: 'year', title: 'Год выпуска' },
      {
        name: 'gild',
        title: 'Цех',
        getCellValue: row => row.currentProfession?.gild
      },
      {
        name: 'currentProfession',
        title: 'Текущая получаемая профессия',
        getCellValue: row => row.currentProfession?.name
      },
      {
        name: 'weeks',
        title: 'Разница недель',
        getCellValue: row => row.currentProfession?._id ? Moment(row.currentProfession?.journal?.slice(-1)[0].endDate).diff(Moment().day(0), 'weeks') : null
      },
    ],
    grouping: [],
    selection: [],
    filters: [{}],
    profColumns: ['currentProfession'],
    profFilterOperations: ['contains', 'notContains', 'startsWith', 'endsWith', 'empty'],
    yearColumns: ['year'],
    yearFilterOperations: ['equal', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'],
    expandedRowIds: [],
    pageSizes: [10, 25, 100],
    filteringColumnExtensions: [
      {
        columnName: 'currentProfession',
        predicate: (value, filter, row) =>{
          if (filter?.operation === 'empty'){
            return _.isEmpty(value);
          }
          return IntegratedFiltering.defaultPredicate(value, filter, row);
        }
      },
    ],
    tableColumnExtensions: [
      { columnName: 'weeks', align: 'center' },
      { columnName: 'gild', align: 'center' },
      { columnName: 'name', wordWrapEnabled: true },
      { columnName: 'currentProfession', wordWrapEnabled: true },
    ]
  };

  changeSelection = selection => {
    const data = [];
    this.state.exportRawData.filter(n => selection.indexOf(n.id) !== -1).forEach(row => {
      let flatRow = {
        name: row.name,
        speciality: row.speciality,
        year: row.year
      };
      row.professions.map((item, index) => {
        flatRow['profession_'+index] = item.name;
        flatRow['controller_'+index] = item.controller?.profile.name;
        flatRow['master_'+index] = item.master?.profile.name;
        flatRow['instructor_'+index] = item.instructor?.profile.name;
        flatRow['points_'+index] = getAvgPoints(item.journal);
      });
      data.push(flatRow);
    });
    this.setState({ selection, exportData: data })
  };

  changeSorting = sorting => this.setState({ sorting });

  changeFilters = filters => this.setState({ filters });

  changeExpandedDetails = expandedRowIds => this.setState({ expandedRowIds });

  render() {
    const {
      columns,
      grouping,
      selection,
      pageSizes,
      filters,
      expandedRowIds,
      profColumns,
      profFilterOperations,
      filteringColumnExtensions,
      yearColumns,
      yearFilterOperations,
      tableColumnExtensions,
      exportData
    } = this.state;
    const {rows, checked, handleChange, classes} = this.props;

    return (
      <MuiThemeProvider theme={gridTheme}>
        <EnhancedTableToolbar
          numSelected={selection.length}
          checked={checked}
          handleChange={handleChange}
          exportData={exportData}
        />
        <div className={classes.tableWrapper}>
          <Grid
            rows={rows.map((e, k) => {return {id: k, ...e}})}
            columns={columns}
          >
            <DataTypeProvider
              for={profColumns}
              availableFilterOperations={profFilterOperations}
            />
            <DataTypeProvider
              for={yearColumns}
              availableFilterOperations={yearFilterOperations}
            />
            <DataTypeProvider
              for={['weeks']}
              formatterComponent={weeksFormatter}
              availableFilterOperations={yearFilterOperations}
            />
            <FilteringState
              filters={filters}
              onFiltersChange={this.changeFilters}
            />
            <SortingState
              defaultSorting={[
                { columnName: 'name', direction: 'asc' }
              ]}
              onSortingChange={this.changeSorting}
            />
            <GroupingState
              grouping={grouping}
            />
            <RowDetailState
              expandedRowIds={expandedRowIds}
              onExpandedRowIdsChange={this.changeExpandedDetails}
            />
            <SelectionState
              selection={selection}
              onSelectionChange={this.changeSelection}
            />
            <PagingState
              defaultCurrentPage={0}
              defaultPageSize={10}
            />
            <IntegratedFiltering columnExtensions={filteringColumnExtensions} />
            <IntegratedSorting />
            <IntegratedSelection />
            <Getter
              name="rows"
              computed={({ rows }) => {
                this.state.exportRawData = rows;
                return rows;
              }}
            />
            <IntegratedPaging />
            <IntegratedGrouping />
            <TableGrid
              messages={{noData: 'Нет данных.'}}
              columnExtensions={tableColumnExtensions}
            />
            <TableHeaderRow
              showSortingControls
              messages={tableHeaderMessages}
            />
            <TableSelection
              showSelectAll
            />
            <TableFilterRow
              messages={filterRowMessages}
              showFilterSelector
              iconComponent={FilterIcon}
            />
            <TableRowDetail
              contentComponent={GridDetailContainer}
            />
            <TableGroupRow />
            <PagingPanel
              pageSizes={pageSizes}
              messages={pagingPanelMessages}
            />
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }

}

EnchantedTable = withStyles(styles)(EnchantedTable);


class MainPage extends BaseComponent {

  state ={
    editingTodo: null,
    checked: false,
    rows: []
  };

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    this.setState({
      rows: nextProps.students
    });
  };

  handleSwitchChange = () => {
    this.setState((this.state.checked)?{
      checked: false,
      rows: this.props.students
    }:{
      checked: true,
      rows: this.props.students.concat(this.props.studentsArchive)
    })
  };

  render() {
    const { checked, students, listExists, loading, classes } = this.props;
    const { rows } = this.state;

    if (!listExists) {
      return <NotFoundPage />;
    }

    let Page;
    if (!students || !students.length) {
      Page = (
        <Message
          title={'Записи отсутствуют.'}
          subtitle={'Для работы закрепите студентов.'}
        />
      );
    } else {
      Page = (
        <Paper className={classes.root}>
          <EnchantedTable
            handleChange={this.handleSwitchChange}
            checked={checked}
            rows={rows}
          />
        </Paper>
      );
    }

    return (
      <div className="page lists-show">
        <div className="content-scrollable list-items">
          {loading
            ? <Message title={'Загрузка списка студентов...'} />
            : Page}
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {
  loading: PropTypes.bool,
  listExists: PropTypes.bool,
  students: PropTypes.array
};

export default withStyles(styles)(MainPage);
