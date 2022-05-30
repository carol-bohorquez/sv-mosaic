import * as React from "react";
import { useState, useEffect, useMemo, useRef, ReactElement } from "react";
//import jsvalidator from "jsvalidator";
import styled from "styled-components";

import TitleBar from "../internal/TitleBar.jsx";
import DataViewControlDisplay from "./DataViewControlDisplay";
import DataViewPager from "./DataViewPager";
import DataViewControlLimit from "./DataViewControlLimit";
import DataViewFilters from "../internal/DataViewFilters.jsx";
import theme from "../../utils/theme.js";
import { DataViewDisplayList, DataViewDisplayGrid } from "./DataViewDisplays";
import { DataViewProps } from "./DataViewTypes";

const StyledWrapper = styled.div`
	font-family: ${theme.fontFamily};
	font-weight: 400;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	
	& > .headerRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		-ms-flex: 0 0 auto;
		-webkit-flex: 0 0 auto;
		flex: 0 0 auto;
		margin-bottom: 8px;
	}

	& > .headerRow.title {
		margin-left: 12px;
	}
	
	& > .headerRow > .right {
		display: flex;
		align-items: center;
		align-self: flex-end;
	}

	& > .viewContainer {
		overflow: auto;
	}
	
	&.loading {
		opacity: .5;
		pointer-events: none;
	}

	&.sticky {
		height: 100%;
	}
`;

function DataView (props: DataViewProps): ReactElement  {
	/*
	jsvalidator.validate(props, {
		type : "object",
		schema : [
			{
				name : "title",
				type : "string"
			},
			{
				name : "columns",
				type : "array",
				schema : {
					type : "object",
					schema : [
						{
							name : "name",
							type : "string",
							required : true
						},
						{
							name : "column",
							type : "string"
						},
						{
							name : "label",
							type : "string"
						},
						{
							name : "style",
							type : "object",
							schema : [
								{ name : "bold", type : "boolean" },
								{ name : "italic", type : "boolean" },
								{ name : "strikeThrough", type : "boolean" },
								{ name : "noWrap", type : "boolean" },
								{ name : "ellipsis", type : "boolean" },
								{ name : "maxWidth", type : "string" },
								{ name : "textTransform", type : "string" }
							],
							allowExtraKeys : false
						},
						{
							name : "sortable",
							type : "boolean"
						},
						{
							name : "transforms",
							type : "array",
							schema : {
								type : "function"
							}
						}
					],
					allowExtraKeys : false
				}
			},
			{
				name : "filters",
				type : "array"
			},
			{
				name : "filter",
				type : "object"
			},
			{
				name : "activeFilters",
				type : "array",
				schema : {
					type : "string"
				}
			},
			{
				name : "activeColumns",
				type : "array",
				schema : {
					type : "string"
				}
			},
			{
				name : "primaryActions",
				type : "array"
			},
			{
				name : "bulkActions",
				type : "array"
			},
			{
				name : "additionalActions",
				type : "array"
			},
			{
				name : "buttons",
				type : "array"
			},
			{
				name : "display",
				type : "string"
			},
			{
				name : "savedView",
				type : "object",
				schema : [
					{ name : "id", type : "string" },
					{ name : "label", type : "string" },
					{ name : "type", type : "string", enum : ["default", "shared", "mine"] },
					{ name : "state", type : "object" }
				],
				allowExtraKeys : false
			},
			{
				name : "displayOptions",
				type : "array"
			},
			{
				name : "data",
				type : "array"
			},
			{
				name : "count",
				type : "number"
			},
			{
				name : "sort",
				type : "object",
				schema : [
					{ name : "name", type : "string" },
					{ name : "dir", type : "string", enum : ["asc", "desc"] }
				],
				allowExtraKeys : false
			},
			{
				name : "limit",
				type : "number"
			},
			{
				name : "limitOptions",
				type : "array",
				schema : {
					type : "number"
				}
			},
			{
				name : "skip",
				type : "number"
			},
			{
				name : "loading",
				type : "boolean"
			},
			{
				name : "sticky",
				type : "boolean"
			},
			{
				name : "gridColumnsMap",
				type : "object"
			},
			{
				name : "onSkipChange",
				type : "function"
			},
			{
				name : "onLimitChange",
				type : "function"
			},
			{
				name : "onSortChange",
				type : "function"
			},
			{
				name : "onDisplayChange",
				type : "function"
			},
			{
				name : "onActiveFiltersChange",
				type : "function"
			},
			{
				name : "onColumnsChange",
				type : "function"
			},
			{
				name : "onSavedViewSave",
				type : "function"
			},
			{
				name : "onSavedViewChange",
				type : "function"
			},
			{
				name : "onSavedViewRemove",
				type : "function"
			},
			{
				name : "onSavedViewGetOptions",
				type : "function"
			},
			{
				name: "savedViewAllowSharedViewSave",
				type : "boolean"
			}
		],
		allowExtraKeys : false,
		throwOnInvalid : true
	}); 
*/

	// declare the hooks
	const [state, setState] = useState({
		checked : [],
		checkedAllPages : false
	});
	
	// set defaults
	const display = props.display || "list";
	const displayOptions = useMemo(() => props.displayOptions || [display], [display, props.displayOptions]);
	
	const displayControlEnabled = props.onDisplayChange !== undefined && displayOptions.length > 1;

	const savedViewEnabled = 
		props.onSavedViewSave !== undefined &&
		props.onSavedViewChange !== undefined &&
		props.onSavedViewGetOptions !== undefined &&
		props.onSavedViewRemove !== undefined &&
		props.savedView !== undefined
	;
	
	const onCheckAllClick = function() {
		const allChecked = state.checked.every(val => val === true);
		
		setState({
			...state,
			checked : state.checked.map(val => !allChecked),
			checkedAllPages : false
		});
	}
	
	const onCheckboxClick = function(i) {
		const newChecked = [...state.checked];
		newChecked[i] = !newChecked[i];
		
		setState({
			...state,
			checked : newChecked,
			checkedAllPages : false
		});
	}

	const onCheckAllPagesClick = function() {
		// if the checkedAllPages was previously clicked we also uncheck all of the checkboxes
		const checked = state.checkedAllPages ? state.checked.map(val => false) : state.checked;

		setState({
			...state,
			checked,
			checkedAllPages : !state.checkedAllPages
		})
	}
	
	useEffect(() => {
		if (props.data && viewContainerRef.current) {
			// on data change scroll to the top
			viewContainerRef.current.scrollTo(0, 0);
		}
	}, [props.data, props.display])

	useEffect(() => {
		setState({
			...state,
			checked : props.data.map(val => false)
		});
	}, [props.data]);

	const displayOptionsFull = useMemo(() => {
		return displayOptions.map(val => {
			if (val === "list") {
				return DataViewDisplayList;
			} else if (val === "grid") {
				return DataViewDisplayGrid;
			} else if (typeof val === "string") {
				throw new Error("Unknown view option")
			} else {
				return val;
			}
		});
	}, [displayOptions]);

	const activeDisplay = displayOptionsFull.find(val => val.name === display);
	if (activeDisplay === undefined) {
		throw new Error(`Display '${display}' is not valid in the passed displayOptions.`);
	}

	const Display = activeDisplay.component;
	
	const savedViewState = {
		limit : props.limit,
		sort : props.sort,
		display : props.display,
		filter : props.filter,
		activeFilters : props.activeFilters,
		activeColumns : props.activeColumns,
	}
	
	const savedViewCallbacks = {
		onSave : props.onSavedViewSave,
		onChange : props.onSavedViewChange,
		onGetOptions : props.onSavedViewGetOptions,
		onRemove : props.onSavedViewRemove
	}
	
	const limitOptions = useMemo(() => {
		return props.limitOptions || [
			25,
			50,
			100
		]
	}, [props.limitOptions]);
	
	const viewContainerRef = useRef(null);

	return (
		<StyledWrapper className={`
			${ props.loading ? "loading" : "" }
			${ props.sticky ? "sticky" : "" }
		`}>
			<div className="headerRow title">
				<TitleBar
					title={props.title}
					buttons={props.buttons}
					savedViewEnabled={savedViewEnabled}
					savedView={props.savedView}
					savedViewState={savedViewState}
					savedViewCallbacks={savedViewCallbacks}
					savedViewAllowSharedViewSave={(props.savedViewAllowSharedViewSave !== undefined) ? props.savedViewAllowSharedViewSave : false }
				/>
			</div>
			<div className="headerRow filters">
				<div className="left">
					{
						props.filters &&
						<DataViewFilters
							loading={props.loading}
							filter={props.filter}
							filters={props.filters}
							activeFilters={props.activeFilters}
							onActiveFiltersChange={props.onActiveFiltersChange}
						/>
					}
				</div>
				<div className="right">
					{
						displayControlEnabled &&
						<DataViewControlDisplay
							display={display}
							displayOptions={displayOptionsFull}
							onDisplayChange={props.onDisplayChange}
						/>
					}
					{
						props.onLimitChange !== undefined &&
						<DataViewControlLimit
							limit={props.limit}
							options={limitOptions}
							onLimitChange={props.onLimitChange}
						/>
					}
					{
						props.onSkipChange !== undefined &&
						<DataViewPager
							limit={props.limit}
							skip={props.skip}
							count={props.count}
							onSkipChange={props.onSkipChange}
						/>
					}
				</div>
			</div>
			<div
				ref={viewContainerRef}
				className={`
					viewContainer
				`}
			>
				<Display
					checked={state.checked}
					checkedAllPages={state.checkedAllPages}
					columns={props.columns}
					bulkActions={props.bulkActions}
					sort={props.sort}
					data={props.data}
					additionalActions={props.additionalActions}
					primaryActions={props.primaryActions}
					activeColumns={props.activeColumns}
					gridColumnsMap={props.gridColumnsMap}
					limit={props.limit}
					count={props.count}
					rowCount={props.data.length}
					onSortChange={props.onSortChange}
					onColumnsChange={props.onColumnsChange}
					onCheckAllClick={onCheckAllClick}
					onCheckboxClick={onCheckboxClick}
					onCheckAllPagesClick={onCheckAllPagesClick}
				/>
			</div>
			{
				props.loading === false && !props.data.length &&
				<div className="noResults">
					<p>No results were found.</p>
				</div>
			}
		</StyledWrapper>
	)
}

export default DataView;