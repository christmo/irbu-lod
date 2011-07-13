Ext.ns('com.quizzpot.tutorial');

com.quizzpot.tutorial.ArrayGridTutorial = {
	init: function(){
		//data
		var myData = [
			['3m Co',71.72,0.02,0.03,'9/1 12:00am'],
			['Alcoa Inc',29.01,0.42,1.47,'9/1 12:00am'],
			['Altria Group Inc',83.81,0.28,0.34,'9/1 12:00am'],
			['American Express Company',52.55,0.01,0.02,'9/1 12:00am'],
			['American International Group, Inc.',64.13,0.31,0.49,'9/1 12:00am'],
			['AT&T Inc.',31.61,-0.48,-1.54,'9/1 12:00am'],
			['Boeing Co.',75.43,0.53,0.71,'9/1 12:00am'],
			['Caterpillar Inc.',67.27,0.92,1.39,'9/1 12:00am']
		];
		
		//creating the store
		var store = new Ext.data.ArrayStore({
			fields: [
			   {name: 'company'},
			   {name: 'price', type: 'float'},
			   {name: 'change', type: 'float'},
			   {name: 'pctChange', type: 'float'},
			   {name: 'updated', type: 'date', dateFormat: 'n/j h:ia'}
			]
		});
		//loading the data from the array
		store.loadData(myData);
		
		//creates the selection model
		var mySelectionModel = new Ext.grid.CheckboxSelectionModel({singleSelect: false});

		//Creando el objeto Ext.grid.GridPanel
		var grid = new Ext.grid.GridPanel({
			title:'Companies',
			store: store,
			renderTo: 'frame',
			columns: [
				new Ext.grid.RowNumberer(), //a number in each row
			  	mySelectionModel, //checkbox for 
				{id:'company',header: "Company", width: 160, sortable: true, dataIndex: 'company'},
				{header: "Price", width: 75, sortable: true, dataIndex: 'price'},
				{header: "Change", width: 75, sortable: true, dataIndex: 'change'},
				{header: "% change", width: 75, sortable: true, dataIndex: 'pctChange'},
				{header: "Updated", width: 85, sortable: true, renderer: Ext.util.Format.dateRenderer('m/d/Y'), dataIndex: 'updated'}
			],
			sm: mySelectionModel,
			stripeRows: true,
			height:250,
			width:550        
		});


	}
}

Ext.onReady(com.quizzpot.tutorial.ArrayGridTutorial.init,com.quizzpot.tutorial.ArrayGridTutorial);
