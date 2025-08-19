sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, MessageToast, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("converted.orderlistview.controller.OrderListView", {
		onInit: function() {
			// Load mock data for orders
			const oOrderModel = new JSONModel();
			oOrderModel.loadData("model/mockData/orders.json");
			this.getView().setModel(oOrderModel, "orders");

			// Set the model for the filter in the view
			this.getView().setModel(new JSONModel({
				filter: {
					status: "" // Initialize filter status to empty string
				}
			}), "filter");
		},

		/**
		 * Handles search input changes
		 * @param {sap.ui.base.Event} oEvent - The search event
		 */
		onSearch: function(oEvent) {
			const sQuery = oEvent.getParameter("query");
			const oTable = this.getView().byId("orderTable");
			const oBinding = oTable.getBinding("items");
			const aFilters = [];

			if (sQuery) {
				aFilters.push(new Filter([
					new Filter("OrderID", FilterOperator.Contains, sQuery),
					new Filter("Product", FilterOperator.Contains, sQuery),
					new Filter("Status", FilterOperator.Contains, sQuery)
				], false)); // Use OR operator
			}

			oBinding.filter(aFilters);
		},

		/**
		 * Handles filter change event
		 * @param {sap.ui.base.Event} oEvent - The select event from the status dropdown
		 */
		onStatusFilterChange: function(oEvent) {
			const sStatus = oEvent.getParameter("selectedItem").getKey();
			this.getView().getModel("filter").setProperty("/filter/status", sStatus); // Set to filter model
			const oTable = this.getView().byId("orderTable");
			const oBinding = oTable.getBinding("items");
			const aFilters = [];

			if (sStatus) {
				aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
			}

			oBinding.filter(aFilters);
		},

		/**
		 * Exports table data to CSV format.
		 */
		onExportToCSV: function() {
			const oTable = this.getView().byId("orderTable");
			const oData = oTable.getModel("orders").getData();
			const sCSV = this._convertToCSV(oData);

			const oBlob = new Blob([sCSV], { type: "text/csv" });
			const sUrl = URL.createObjectURL(oBlob);
			const oLink = document.createElement("a");
			oLink.href = sUrl;
			oLink.download = "orders.csv";
			oLink.click();
			URL.revokeObjectURL(sUrl);
		},

		/**
		 * Converts a JSON array to CSV format.
		 * @param {array} aData - The JSON data array to convert.
		 * @returns {string} - The CSV formatted string.
		 */
		_convertToCSV: function(aData) {
			if (!aData || aData.length === 0) {
				return "";
			}

			const aHeaders = Object.keys(aData[0]);
			let sCSV = aHeaders.join(",") + "\n";
			aData.forEach(row => {
				const aValues = aHeaders.map(header => `"${(row[header] || "").toString().replace(/"/g, '""')}"`);
				sCSV += aValues.join(",") + "\n";
			});
			return sCSV;
		}
	});
});
