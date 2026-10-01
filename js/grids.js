 // Default Widget Templates configurations and template inner HTML structures
        const widgetTemplates = {
            recent_activity: { w: 3, h: 10, title: "Recent Activity", content: `<div class="p-4 custom-scroll flex-1 space-y-3 text-xs"><div class="card-body"><div class="chart-area"><div class="iframe-container"><iframe src="recentlog.html" allowfullscreen></iframe></div></div></div></div>` },
            map_view: { w: 5, h: 5, title: "Map View", content: `<div class="card-body"><div class="chart-area"><div class="iframe-container_map"><iframe src="map_view.html" allowfullscreen></iframe></div></div></div>` },
            devices: { w: 4, h: 5, title: "Devices", content: `<div class="p-4 custom-scroll overflow-y-auto flex-1 space-y-3 text-xs"><div class="card-body"><div class="chart-area"><div class="iframe-container"><iframe src="devices_view.html" allowfullscreen></iframe></div></div></div></div>` },
            pie_chart: { w: 5, h: 5, title: "Pie Chart", content: `<div class="p-4 custom-scroll flex-1 space-y-3 text-xs"><div class="card-body"><div class="chart-area"><div class="iframe-container"><iframe src="piechart.html" allowfullscreen></iframe></div></div></div></div>` },
            bar_chart: { w: 4, h: 5, title: "Bar Chart", content: `<div class="p-4 custom-scroll flex-1 space-y-3 text-xs"><div class="card-body"><div class="chart-area"><div class="iframe-container"><iframe src="barchart.html" allowfullscreen></iframe></div></div></div></div>` }
        };
         let grid = null;

        // Initialize Gridstack with layout options
        document.addEventListener('DOMContentLoaded', () => {
            grid = GridStack.init({
                cellHeight: 80,
                margin: 8,
                animate: true,
                minRow: 1,
                disableOneColumnMode: false, // Ensures advanced responsiveness rules on smaller viewports
                float: false
            });

            // Populate initially with standard dashboard profile layout
            Object.keys(widgetTemplates).forEach(key => addWidgetToGrid(key));
        });

        // Widget UI Component Builder
        function createWidgetDOM(id, title, contentHTML) {
            const el = document.createElement('div');
            el.setAttribute('id', `widget-${id}`);
            el.className = 'grid-stack-item';
            
            el.innerHTML = `
                <div class="grid-stack-item-content">
                    <div class="bg-white border-b border-gray-100 px-4 py-2.5 flex justify-between items-center cursor-move select-none">
                        <span class="font-bold text-gray-700 tracking-wide text-sm truncate">${title}</span>
                        <div class="flex items-center gap-3 text-gray-400">
                            <button onclick="minimizeWidget('${id}')" class="hover:text-amber-500 transition-colors" title="Minimize"><i class="fas fa-minus text-xs"></i></button>
                            <button onclick="closeWidget('${id}')" class="hover:text-red-500 transition-colors" title="Close"><i class="fas fa-times text-sm"></i></button>
                        </div>
                    </div>
                    ${contentHTML}
                </div>
            `;
            return el;
        }

        // Framework actions
        function addWidgetToGrid(templateKey, customName = '') {
            const id = 'w-' + Math.random().toString(36).substr(2, 9);
            const template = widgetTemplates[templateKey];
            const title = customName.trim() || template.title;
            
            const widgetDOM = createWidgetDOM(id, title, template.content);
            grid.addWidget(widgetDOM, {
                w: template.w,
                h: template.h,
                autoPosition: true
            });

            // Store configuration specs safely on DOM element metadata for restorative pipelines
            widgetDOM.dataset.templateKey = templateKey;
            widgetDOM.dataset.customTitle = title;
        }

        function closeWidget(id) {
            const el = document.getElementById(`widget-${id}`);
            grid.removeWidget(el);
        }

        function minimizeWidget(id) {
            const el = document.getElementById(`widget-${id}`);
            const title = el.dataset.customTitle;
            const templateKey = el.dataset.templateKey;

            // Capture positional dimensions data configuration profiles prior to destruction
            const nodeData = el.gridstackNode;
            const savedAttrs = { w: nodeData.w, h: nodeData.h };

            grid.removeWidget(el);

            // Construct tray reference block
            const trayBtn = document.createElement('button');
            trayBtn.id = `tray-${id}`;
            trayBtn.className = "bg-slate-700 hover:bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded shadow flex items-center gap-2 transition-all";
            trayBtn.innerHTML = `<i class="fas fa-window-maximize"></i> <span class="max-w-[100px] truncate">${title}</span>`;
            
            trayBtn.onclick = () => {
                const restoredDOM = createWidgetDOM(id, title, widgetTemplates[templateKey].content);
                restoredDOM.dataset.templateKey = templateKey;
                restoredDOM.dataset.customTitle = title;
                
                grid.addWidget(restoredDOM, {
                    w: savedAttrs.w,
                    h: savedAttrs.h,
                    autoPosition: true
                });
                trayBtn.remove();
            };

            document.getElementById('minimize-bar').appendChild(trayBtn);
        }

        // Modal UX Actions
        function openModal() {
            const m = document.getElementById('widgetModal');
            m.classList.remove('hidden');
            document.getElementById('widgetCustomName').value = '';
        }

        function closeModal() {
            document.getElementById('widgetModal').classList.add('hidden');
        }

        function submitNewWidget() {
            const nameInput = document.getElementById('widgetCustomName').value;
            const selectTemplate = document.getElementById('widgetTemplateSelect').value;
            
            addWidgetToGrid(selectTemplate, nameInput);
            closeModal();
        }

//=============== load parse ====================
       $(document).ready(function() {
        let getuser = localStorage.getItem('UserObjectId');
            let param = JSON.stringify({"objectId":getuser});
            let compare = '?where=';
            let url = compare.concat(param);
		$.ajax({	
		 type: 'GET',
		 headers: {
			'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_API_KEY,
			'Content-Type': "application/json"
		 }, 
		url: BASE_URL+"1/users/"+url, 
		data: '{"results":[{}]}',
			data: {order: '-createdAt', limit: 1000},
			dataType: "json",
			error: function() {
				//alert("No data found.");
			},		
			success: function (data) {
				var jstr = JSON.stringify(data);
				var json = JSON.parse(jstr);
				for(var i=0; i< json.results.length; i++)
				{
					let objectId = json.results[i].objectId;
                    let winactivity = json.results[i].window_activity;
                    let winmapview = json.results[i].window_mapview;
                    localStorage.setItem("mapview", winmapview);
				}
                
			}
			
			
		});	
	//var x = function () {
		//$('#myPieChart').load(window.location.pathname).fadeIn(1500);
		//$('myPieChart').fadeIn(1500);
	  //setTimeout(x,5000);
	//}
	//x();

		});