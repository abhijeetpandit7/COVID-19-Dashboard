// Define dictionary for creating drop-down
statesUT = {
	'AN':'Andaman and Nicobar Islands',	'AP':'Andhra Pradesh',	'AR':'Arunachal Pradesh',	'AS':'Assam',	'BR':'Bihar',
	'CH':'Chandigarh',	'CT':'Chhattisgarh',	'DN':'Dadra and Nagar Haveli and Daman and Diu',	'DL':'Delhi',
	'GA':'Goa',	'GJ':'Gujarat',	'HR':'Haryana',	'HP':'Himachal Pradesh',	'JK':'Jammu and Kashmir',	'JH':'Jharkhand',
	'KA':'Karnataka',	'KL':'Kerala',	'LA':'Ladakh',	'LD':'Lakshadweep',	'MP':'Madhya Pradesh',	'MH':'Maharashtra',
	'MN':'Manipur',	'ML':'Meghalaya',	'MZ':'Mizoram',	'NL':'Nagaland',	'OR':'Odisha',	'PY':'Puducherry',
	'PB':'Punjab',	'RJ':'Rajasthan',	'SK':'Sikkim',	'TN':'Tamil Nadu',	'TG':'Telangana',	'TR':'Tripura',
	'UP':'Uttar Pradesh',	'UT':'Uttarakhand',	'WB':'West Bengal'
}
key = ['AN','AP','AR','AS','BR','CH','CT','DN','DL','GA','GJ','HR','HP','JK','JH','KA','KL','LA','LD','MP','MH',
	'MN','ML','MZ','NL','OR','PY','PB','RJ','SK','TN','TG','TR','UP','UT','WB']
const url1 = "https://api.covid19india.org/data.json";	
$.get(url1,function(data,value){
	// India all cases
	const confirmedCases = data.statewise[0].confirmed;
	const activeCases = data.statewise[0].active;
	const recoveredCases = data.statewise[0].recovered;
	const deceasedCases = data.statewise[0].deaths;
	const testTotal = data.tested[data.tested.length-1].totalsamplestested;
	const deltaConfirmed = data.statewise[0].deltaconfirmed;
	const deltaDeceased = data.statewise[0].deltadeaths;
	const deltaRecovered = data.statewise[0].deltarecovered;
	const deltaTestTotal = data.tested[data.tested.length-1].samplereportedtoday;
	const d = data.statewise[0].lastupdatedtime;

	$(".confirmed").text(Commas(confirmedCases));
	$(".deltaConfirmed").append(Commas(deltaConfirmed));
	$(".active").text(Commas(activeCases));
	$(".activePer").append(percentile(activeCases,confirmedCases));
	$(".recovered").text(Commas(recoveredCases));
	$(".recoveredPer").append(percentile(recoveredCases,confirmedCases));
	// $(".deltaRecovered").append(Commas(deltaRecovered));
	$(".deceased").text(Commas(deceasedCases));
	$(".deceasedPer").append(percentile(deceasedCases,confirmedCases));
	// $(".deltaDeceased").append(Commas(deltaDeceased));
	$(".test").text(Commas(testTotal));
	$(".deltaTest").append(Commas(deltaTestTotal));
	$('.timestamp').text(timeCalc(d));
	const scode = {};

	// District Database
	const districtwise= [];
	const url3 = "https://api.covid19india.org/v3/data.json";
	$.get(url3,function(data2){
		for(var state in data2){
			if(state===stateCode){
				for(var sub1 in data2[state]){
					if(sub1==="districts"){
						for(var districts in data2[state][sub1]){	
							for(var sub2 in data2[state][sub1][districts]){
								if(sub2==="total"){
									for(var sub3 in data2[state][sub1][districts][sub2]){
										if(sub3==="confirmed"){
											if($("p").hasClass("stateHeader")){
												$("tbody").append(`<tr>
												<td class="">${districts}</td>
												<td class="text-danger tableData">${Commas(data2[state][sub1][districts][sub2].confirmed)}</td>
												<td class="text-info tableData">${Commas((data2[state][sub1][districts][sub2].confirmed)-
													(data2[state][sub1][districts][sub2].recovered)-Commas(data2[state][sub1][districts][sub2].deceased))}</td>
												<td class="text-success tableData">${Commas(data2[state][sub1][districts][sub2].recovered)}</td>
												<td class="text-light tableData">${Commas(data2[state][sub1][districts][sub2].deceased)}</td>
												<td class="text-warning tableData">${Commas(data2[state][sub1][districts][sub2].tested)}</td>
												</tr>`);
											}
											
											districtwise.push({
												"district":districts,
												"confirmed":data2[state][sub1][districts][sub2].confirmed,
												"deceased":data2[state][sub1][districts][sub2].deceased,
												"recovered":data2[state][sub1][districts][sub2].recovered,
												"tested":data2[state][sub1][districts][sub2].tested
											});	
										}
									}
								}
							}
						}	
					}
				}
			}
		}	
	});	
	// Make table sorttable
	//var newTableObject = document.getElementById('table')
	//sorttable.makeSortable(newTableObject);

	for(var i=1;i<data.statewise.length;i++){
		//Assigning timestamp
		scode[data.statewise[i].statecode] = data.statewise[i].state;
		scode[data.statewise[i].statecode+'time'] = data.statewise[i].lastupdatedtime;
		//State all cases
		if(!($("p").hasClass("stateHeader"))){
			$("tbody").append(`<tr>
			<td class="">${data.statewise[i].state}</td>
			<td class="text-danger tableData">${Commas(data.statewise[i].confirmed)}</td>
			<td class="text-info tableData">${Commas(data.statewise[i].active)}</td>
			<td class="text-success tableData">${Commas(data.statewise[i].recovered)}</td>
			<td class="text-light tableData">${Commas(data.statewise[i].deaths)}</td>
			</tr>`);
		}
	}
	// Add buttons to state menubar
	key.forEach(function(element){
		$("header").append(`
		<form action="/${statesUT[element]}" method="get">
		<button type="submit" style="height: 2rem;" class="btn dropdown-item demo btn-light" name="button" value=${element}>
		${statesUT[element]}</button>
		</form>
		`);
	})
	// Make table sorttable
	//var newTableObject = document.getElementById('table')
	//sorttable.makeSortable(newTableObject);

	////    State Header    ////
	const url2 = "https://api.covid19india.org/v3/timeseries.json";  
	$.get(url2,function(data1){
		var d = new Date();
		//Previous date (Since daily updating database)
		var d2 = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + (d.getDate()-1)).slice(-2);
		
		for(var state in data1){				
			if(state===stateCode){
				for(var date in data1[state]){
					if(date===d2){					
						const confirmedCases = data1[state][date].total.confirmed;		
						const recoveredCases = data1[state][date].total.recovered;				
						const deceasedCases = data1[state][date].total.deceased;
						const activeCases = (confirmedCases-recoveredCases-deceasedCases);					
						const testTotal = data1[state][date].total.tested;				
						const deltaConfirmed = data1[state][date].delta.confirmed;
						const deltaRecovered = data1[state][date].delta.recovered;
						const deltaDeceased = data1[state][date].delta.deceased;
						const deltaTestTotal = data1[state][date].delta.tested;
						
						$(".stateHeader").text(scode[stateCode]+" | Key Insights");
						$(".stateConfirmed").text(Commas(confirmedCases));
						$(".stateDeltaConfirmed").append(Commas(deltaConfirmed));
						$(".stateActive").text(Commas(activeCases));					
						$(".stateActivePer").append(percentile(activeCases,confirmedCases));
						$(".stateRecovered").text(Commas(recoveredCases));
						$(".stateRecoveredPer").append(percentile(recoveredCases,confirmedCases));
						// $(".stateDeltaRecovered").append(Commas(deltaRecovered) + rate(deltaRecovered,recoveredCases));
						$(".stateDeceased").text(Commas(deceasedCases));
						$(".stateDeceasedPer").append(percentile(deceasedCases,confirmedCases));
						// $(".stateDeltaDeceased").append(Commas(deltaDeceased) + rate(deltaDeceased,deceasedCases));
						$(".stateTest").text(Commas(testTotal));
						$(".stateDeltaTest").append(Commas(deltaTestTotal));
						$('.stateTimestamp').text(timeCalc(scode[stateCode+"time"]));		
					}
				}
			}
		}								
	});
});

//Functions

// Time Calculation
function timeCalc(d){
	var hh = d[11]+d[12];
	var mm = d[14]+d[15];
	var date = d[0]+d[1];
	var month = d[3]+d[4];
	var date1 = new Date(2020, month-1, date,  hh, mm);
	var month1 = date1.toLocaleString('default', { month: 'long' });
	var d2 = new Date();
	var date2 = new Date(2020, d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes());
	if (date2 < date1) {
	date2.setDate(date2.getDate() + 1);
	}
	var msec = date2 - date1;
	var hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(msec / 1000 / 60);
	// Test date before 9 am
	function testDate(){
		if(d2.getHours()>=9){
			// subtract one day from present                           
			d2.setDate(d2.getDate() - 1);  
			return (d2.getDate()+" "+d2.toLocaleString('default', { month: 'long' }));  
		}
		else{
			// subtract two day from present
			d2.setDate(d2.getDate() - 2);  
			return (d2.getDate()+" "+d2.toLocaleString('default', { month: 'long' }));  
		}		
	}

	if(hh===0){
		return ("Cases updated "+mm+" minutes ago - "+date+" "+month1+" ; Tests as of "+testDate()+" , next update 09:00 am.");
	}
	else{
		return ("Cases updated "+hh+" hour, "+mm+" minutes ago - "+date+" "+month1+" ; Tests as of "+testDate()+" , next update 09:00 am.");
	}
}

// Calculate cases percentile
function percentile(delta,total){
	var r = delta*100/(total);
	return (" "+(Math.round((r + Number.EPSILON) * 100) / 100)+"%");
}
// Calculate rate of change
function rate(delta,total){
	var r = delta*100/(total-delta);
	return (" ("+(Math.round((r + Number.EPSILON) * 100) / 100)+"%)");
}
// Add commas to numbers and check if its NaN
function Commas(x) {
	if(!(isNaN(x))){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	else{
		x='-';
		return x;
		
	}
}