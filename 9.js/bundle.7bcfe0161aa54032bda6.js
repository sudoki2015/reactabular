webpackJsonp([9],{1193:function(e,n,a){var s=a(0),t=a(8),r=a(9).PageRenderer;r.__esModule&&(r=r.default);var o=t({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:a(1226)}},componentWillMount:function(){},render:function(){return s.createElement(r,Object.assign({},this.props,{content:this.state.content}))}});o.__catalog_loader__=!0,e.exports=o},1226:function(e,n){e.exports="[![build status](https://secure.travis-ci.org/reactabular/searchtabular.svg)](http://travis-ci.org/reactabular/searchtabular) [![bitHound Score](https://www.bithound.io/github/reactabular/searchtabular/badges/score.svg)](https://www.bithound.io/github/reactabular/searchtabular) [![codecov](https://codecov.io/gh/reactabular/searchtabular/branch/master/graph/badge.svg)](https://codecov.io/gh/reactabular/searchtabular)\n\n# Searchtabular - Search utilities\n\nSearchtabular comes with search helpers. It consists of search algorithms that can be applied to the rows. Just like with sorting, you have to apply it to the rows just before rendering. A column is considered searchable in case it has a unique `property` defined.\n\n> If you want advanced filters including date, number, and boolean, see [searchtabular-antd](https://www.npmjs.com/package/searchtabular-antd).\n\n## API\n\nThe search API consists of three parts. Out of these `search.multipleColumns` and `search.matches` are the most useful ones for normal usage. If the default search strategies aren't enough, it's possible to implement more as long as you follow the same interface.\n\n```javascript\nimport * as search from 'searchtabular';\n\n// Or you can cherry-pick\nimport { multipleColumns } from 'searchtabular';\nimport { multipleColumns as searchMultipleColumns } from 'searchtabular';\n```\n\n### Search\n\n**`search.multipleColumns({ castingStrategy: <castingStrategy>, columns: [<object>], query: {<column>: <query>}, strategy: <strategy>, transform: <transform> })([<rows to query>]) => [<filtered rows>]`**\n\nThis is the highest level search function available. It expects `rows` and `columns` in the same format the `Table` uses. `query` object describes column specific search queries.\n\nIt uses `infix` strategy underneath although it is possible to change it. By default it matches in a case **insensitive** manner. If you want case sensitive behavior, pass `a => a`(identity function) as `transform`.\n\nIt will cast everything but arrays to a string by default. If you want a custom casting behavior, pass a custom function to `castingStrategy(value, column)`. It should return the cast result.\n\n**`search.singleColumn({ castingStrategy: <castingStrategy>, columns: [<object>], searchColumn: <string>, query: <string>, strategy: <strategy>, transform: <transform> })([<rows to query>]) => [<filtered rows>]`**\n\nThis is a more specialized version of `search.multipleColumns`. You can use it to search a specific column through `searchColumn` and `query`.\n\n### Matchers\n\n**`search._columnMatches({ query: <string>, castingStrategy: <castingStrategy>, column: <object>, row: <object>, strategy: <strategy>, transform: <transform> }) => <boolean>`**\n\nThis is a function that can be used to figure out all column specific matches. It is meant only for **internal usage** of the library.\n\nWhen dealing with strings:\n\n**`search.matches({ value: <string>, query: <string>, strategy: <strategy>, transform: <transform> }) => [{ startIndex: <number>, length: <number> }]`**\n\nReturns an array with the matches.\n\nWhen dealing with arrays:\n\n**`search.matches({ value: <string>, query: [<string|[...]>], strategy: <strategy>, transform: <transform> }) => [[{ startIndex: <number>, length: <number> }], ...]`**\n\nReturns a sparse array with the same shape as the original query. If there was a match for an item, it will have the same shape as the string version above, otherwise the array will have a hole in that location.\n\nThis function returns matches against the given value and query. This is particularly useful with highlighting.\n\n### Strategies\n\n**`search.strategies.infix(queryTerm: <string>) => { evaluate(searchText: <string>) => <string>, matches(searchText) => [{ startIndex: <number>, length: <number> }]`**\n\nSearch uses `infix` strategy by default. This means it will match even if the result is in the middle of a `searchText`.\n\nThe strategies operate in two passes - evaluation and matching. The evaluation pass allows us to implement perform fast boolean check on whether or not a search will match. Matching gives exact results.\n\n**`search.strategies.prefix(queryTerm: <string>) => { evaluate(searchText: <string>) => <string>, matches(searchText) => [{ startIndex: <number>, length: <number> }]`**\n\n`prefix` strategy matches from the start.\n\n## Highlighting Search Results\n\nTo make it possible to highlight search results per column, there's a specific `highlightCell` formatter.\n\n## How to Use?\n\nThe general workflow goes as follows:\n\n1. Set up a `Search` control that outputs a query in `{<column>: <query>}` format. If `<column>` is `all`, then the search will work against all columns. Otherwise it will respect the exact columns set. You'll most likely want to use either `reactabular-search-field` or `reactabular-search-columns` (or both) for this purpose or provide an implementation of your own if you are not using Reactabular.\n2. Before rendering the rows, perform `search.multipleColumns({ columns, query })(rows)`. This will filter the rows based on the passed `rows`, `columns` definition, and `query`. A lazy way to do this is to filter at `render()` although you can do it elsewhere too to optimize rendering.\n3. Pass the filtered rows to `Table`.\n\nTo use it, you'll first you have to annotate your rows using `highlighter`. It attaches a structure like this there:\n\n```javascript\n_highlights: {\n  demo: [{ startIndex: 0, length: 4 }]\n}\n```\n\n**Example:**\n\n```jsx\n/*\nimport React from 'react';\nimport { compose } from 'redux';\nimport * as Table from 'reactabular-table';\nimport * as resolve from 'table-resolver';\nimport * as search from 'searchtabular';\n*/\n\nclass HighlightTable extends React.Component {\n  constructor(props) {\n    super(props);\n\n    this.state = {\n      searchColumn: 'all',\n      query: {},\n      columns: [\n        {\n          header: {\n            label: 'Name'\n          },\n          children: [\n            {\n              property: 'name.first',\n              header: {\n                label: 'First Name'\n              },\n              cell: {\n                formatters: [search.highlightCell]\n              }\n            },\n            {\n              property: 'name.last',\n              header: {\n                label: 'Last Name'\n              },\n              cell: {\n                formatters: [search.highlightCell]\n              }\n            }\n          ]\n        },\n        {\n          property: 'age',\n          header: {\n            label: 'Age'\n          },\n          cell: {\n            formatters: [search.highlightCell]\n          }\n        }\n      ],\n      rows: [\n        {\n          id: 100,\n          name: {\n            first: 'Adam',\n            last: 'West'\n          },\n          age: 10\n        },\n        {\n          id: 101,\n          name: {\n            first: 'Brian',\n            last: 'Eno'\n          },\n          age: 43\n        },\n        {\n          id: 103,\n          name: {\n            first: 'Jake',\n            last: 'Dalton'\n          },\n          age: 33\n        },\n        {\n          id: 104,\n          name: {\n            first: 'Jill',\n            last: 'Jackson'\n          },\n          age: 63\n        }\n      ]\n    };\n  }\n  render() {\n    const { searchColumn, columns, rows, query } = this.state;\n    const resolvedColumns = resolve.columnChildren({ columns });\n    const resolvedRows = resolve.resolve({\n      columns: resolvedColumns,\n      method: resolve.nested\n    })(rows);\n    const searchedRows = compose(\n      search.highlighter({\n        columns: resolvedColumns,\n        matches: search.matches,\n        query\n      }),\n      search.multipleColumns({\n        columns: resolvedColumns,\n        query\n      }),\n    )(resolvedRows);\n\n    return (\n      <div>\n        <div className=\"search-container\">\n          <span>Search</span>\n          <search.Field\n            column={searchColumn}\n            query={query}\n            columns={resolvedColumns}\n            rows={resolvedRows}\n            onColumnChange={searchColumn => this.setState({ searchColumn })}\n            onChange={query => this.setState({ query })}\n          />\n        </div>\n        <Table.Provider columns={resolvedColumns}>\n          <Table.Header\n            headerRows={resolve.headerRows({ columns })}\n          />\n\n          <Table.Body rows={searchedRows} rowKey=\"id\" />\n        </Table.Provider>\n      </div>\n    );\n  }\n}\n\n<HighlightTable />\n```\n\n## Components\n\n`searchtabular` provides a couple of convenience components listed below.\n\n### Searching Columns\n\n`searchtabular.Columns` is a single component you can inject within a table header to allow searching per column. It expects `columns` and `onChange` handler. The latter is used to update the search query based on the search protocol.\n\n## How to Use?\n\nConsider the example below.\n\n**Example:**\n\n```jsx\n/*\nimport React from 'react';\nimport * as Table from 'reactabular-table';\nimport * as resolve from 'table-resolver';\nimport * as search from 'searchtabular';\n*/\n\nclass SearchColumnsTable extends React.Component {\n  constructor(props) {\n    super(props);\n\n    this.state = {\n      query: {}, // Search query\n      columns: [\n        {\n          header: {\n            label: 'Name'\n          },\n          children: [\n            {\n              property: 'name.first',\n              header: {\n                label: 'First Name'\n              }\n            },\n            {\n              property: 'name.last',\n              header: {\n                label: 'Last Name'\n              }\n            }\n          ]\n        },\n        {\n          property: 'age',\n          header: {\n            label: 'Age'\n          }\n        }\n      ],\n      rows: [\n        {\n          id: 100,\n          name: {\n            first: 'Adam',\n            last: 'West'\n          },\n          age: 10\n        },\n        {\n          id: 101,\n          name: {\n            first: 'Brian',\n            last: 'Eno'\n          },\n          age: 43\n        },\n        {\n          id: 103,\n          name: {\n            first: 'Jake',\n            last: 'Dalton'\n          },\n          age: 33\n        },\n        {\n          id: 104,\n          name: {\n            first: 'Jill',\n            last: 'Jackson'\n          },\n          age: 63\n        }\n      ]\n    };\n  }\n  render() {\n    const { columns, query, rows } = this.state;\n    const resolvedColumns = resolve.columnChildren({ columns });\n    const resolvedRows = resolve.resolve({\n      columns: resolvedColumns,\n      method: resolve.nested\n    })(rows);\n    const searchedRows = search.multipleColumns({\n      columns: resolvedColumns,\n      query\n    })(resolvedRows);\n\n    return (\n      <Table.Provider columns={resolvedColumns}>\n        <Table.Header\n          headerRows={resolve.headerRows({ columns })}\n        >\n          <search.Columns\n            query={query}\n            columns={resolvedColumns}\n            onChange={query => this.setState({ query })}\n          />\n        </Table.Header>\n\n        <Table.Body rows={searchedRows} rowKey=\"id\" />\n      </Table.Provider>\n    );\n  }\n}\n\n<SearchColumnsTable />\n```\n\n> To disable search on a particular column, set `filterable: false` on a column you want to disable.\n\n### Searching Through a Single Field\n\n`searchtabular.Field` provides a search control with a column listing and an input.\n\n`searchtabular.Field` also supports custom component overrides for the column `<select>` and `<input>` field.\nIt is on you to couple the `onChange` events to the target fields rendered within your custom components.\n\n## How to Use?\n\nConsider the example below.\n\n**Example:**\n\n```jsx\n/*\nimport React from 'react';\nimport * as Table from 'reactabular-table';\nimport * as resolve from 'table-resolver';\nimport * as search from 'searchtabular';\nimport { CustomField, CustomSelect } from './path/to/your/component';\n*/\n\nclass SearchTable extends React.Component {\n  constructor(props) {\n    super(props);\n\n    this.state = {\n      searchColumn: 'all',\n      query: {}, // Search query\n      columns: [\n        {\n          header: {\n            label: 'Name'\n          },\n          children: [\n            {\n              property: 'name.first',\n              header: {\n                label: 'First Name'\n              }\n            },\n            {\n              property: 'name.last',\n              header: {\n                label: 'Last Name'\n              }\n            }\n          ]\n        },\n        {\n          property: 'age',\n          header: {\n            label: 'Age'\n          }\n        }\n      ],\n      rows: [\n        {\n          id: 100,\n          name: {\n            first: 'Adam',\n            last: 'West'\n          },\n          age: 10\n        },\n        {\n          id: 101,\n          name: {\n            first: 'Brian',\n            last: 'Eno'\n          },\n          age: 43\n        },\n        {\n          id: 103,\n          name: {\n            first: 'Jake',\n            last: 'Dalton'\n          },\n          age: 33\n        },\n        {\n          id: 104,\n          name: {\n            first: 'Jill',\n            last: 'Jackson'\n          },\n          age: 63\n        }\n      ]\n    };\n  }\n  render() {\n    const { searchColumn, columns, rows, query } = this.state;\n    const resolvedColumns = resolve.columnChildren({ columns });\n    const resolvedRows = resolve.resolve({\n      columns: resolvedColumns,\n      method: resolve.nested\n    })(rows);\n    const searchedRows = search.multipleColumns({\n      columns: resolvedColumns,\n      query\n    })(resolvedRows);\n\n    return (\n      <div>\n        <div className=\"search-container\">\n          <span>Search</span>\n          <search.Field\n            column={searchColumn}\n            query={query}\n            columns={resolvedColumns}\n            rows={resolvedRows}\n            onColumnChange={searchColumn => this.setState({ searchColumn })}\n            onChange={query => this.setState({ query })}\n            components={{\n              filter: CustomField,\n              select: CustomSelect,\n              props: {\n                filter: {\n                  className: 'custom-textfield',\n                  placeholder: 'Refine Results'\n                },\n                select: {\n                  className: 'custom-select'\n                }\n              }\n            }}\n          />\n        </div>\n        <Table.Provider columns={resolvedColumns}>\n          <Table.Header\n            headerRows={resolve.headerRows({ columns })}\n          />\n\n          <Table.Body rows={searchedRows} rowKey=\"id\" />\n        </Table.Provider>\n      </div>\n    );\n  }\n}\n\nconst CustomField = props => <input className=\"CustomField\" {...props} />;\nconst CustomSelect = ({ options, onChange }) => (\n  <div>\n    <input className=\"controlled-field\" type=\"text\" onChange={onChange} defaultValue=\"all\" />\n    <ul>\n      { options.map(({ key, name, value }) => (\n        <li key={key} data-value={value}>{name}</li>)\n      ) }\n    </ul>\n  </div>\n);\n\n<SearchTable />\n```\n\n## License\n\nMIT. See LICENSE for details.\n"}});