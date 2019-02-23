import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
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
import {SvgIcon, withStyles} from "@material-ui/core";
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
import TableChartIcon from "@material-ui/icons/TableChartSharp";
import Icon from "@material-ui/core/Icon";
import {Getter} from "@devexpress/dx-react-core";
import {_} from "lodash";


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

let EnhancedTableToolbar = props => {
  const { numSelected, classes, checked, handleChange, handleExport } = props;

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
          <Tooltip title="Сохранить Excel">
            <IconButton aria-label="Save excel" onClick={handleExport}>
              <Icon className={classNames(classes.icon, 'far fa-file-excel')} />
            </IconButton>
          </Tooltip>
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
  checkbox: {
    color: theme.palette.primary.default,
    '&$checked': {
      color: theme.palette.primary.default,
    }
  },
  detailContainer: {
    margin: '20px',
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
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
  return ["1","1","1","1","1"]; /*_.chain(journal)
    .map(function (e) {
      return e.points
    })
    .unzip()
    .map((e) => {
      return _.chain(e).meanBy(function (o) {
        return parseInt(o)
      }).floor(2).value()
    })
    .value();*/
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

class EnchantedTable extends BaseComponent {

  state = {
    exportRawData: [],
    columns: [
      { name: 'name', title: 'ФИО' },
      { name: 'speciality', title: 'Специальность' },
      { name: 'year', title: 'Год выпуска' },
      {
        name: 'currentProfession',
        title: 'Текущая получаемая профессия',
        getCellValue: row => row.currentProfession?.name
      },
    ],
    grouping: [],
    selection: [],
    filters: [{}],
    profColumns: ['currentProfession'],
    profFilterOperations: ['contains', 'notContains', 'startsWith', 'endsWith', 'empty'],
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
      }
    ]
  };

  changeSelection = selection => this.setState({ selection });

  changeSorting = sorting => this.setState({ sorting });

  changeFilters = filters => this.setState({ filters });

  changeExpandedDetails = expandedRowIds => this.setState({ expandedRowIds });

  handleExport = event => {
    console.log(this.state.exportRawData);
    const data = [];
    this.state.exportRawData.filter(n => this.state.selection.indexOf(n.id) !== -1).forEach(row => {
      let flatRow = {
        name: row.name,
        speciality: row.speciality,
        year: row.year
      };
      /*row.professions.map((item, index) => {
        flatRow['profession_'+index] = item.name;
        flatRow['controller_'+index] = item.controller.profile.name;
        flatRow['master_'+index] = item.master.profile.name;
        flatRow['instructor_'+index] = item.profile.name;
        flatRow['points_'+index] = getAvgPoints(item.journal);
      });*/
      data.push(flatRow);
    });
    console.log(data);
  };

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
      filteringColumnExtensions
    } = this.state;
    const {rows, checked, handleChange, classes} = this.props;

    return (
      <MuiThemeProvider theme={gridTheme}>
        <EnhancedTableToolbar
          numSelected={selection.length}
          checked={checked}
          handleChange={handleChange}
          handleExport={this.handleExport}
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
            <TableGrid messages={{noData: 'Нет данных.'}} />
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
