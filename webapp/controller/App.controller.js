sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function(Controller, UIComponent) {
	"use strict";

	return Controller.extend("converted.orderlistview.controller.App", {
		onInit: function() {
			// Get the router instance
			const oRouter = UIComponent.getRouterFor(this);

			// Error Handling for routing
			oRouter.attachBypassed(function(oEvent) {
				const sHash = oEvent.getParameter("hash");
				console.warn(`Route bypassed: ${sHash}`); // Use console.warn for warnings
        // Add a more user-friendly error message/redirect here if needed
			});

			// Navigate to main view if no hash is set
			if (!window.location.hash || window.location.hash === "#") {
				// Small delay to allow the router to fully initialize
				setTimeout(() => {
					oRouter.navTo("RouteMain");
				}, 100);
			}
		}
	});
});
