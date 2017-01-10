# Data components for building reactive UIs

## Installation

```js
npm install --save @appbaseio/reactivebase@latest
```

## Using It

```js
import {
  ReactiveBase,
  DataSearch,
  ResultList
} from @appbaseio/reactivebase;
```

```js
<ReactiveBase
	appname="reactivemap_demo"
	username="y4pVxY2Ok"
	password="c92481e2-c07f-4473-8326-082919282c18"
	type="car">
	<div className="row">
		<div className="col s6 col-xs-6">
			<DataSearch
				appbaseField={venue_name_ngrams}
				sensorId="VenueSensor"
				searchInputId="CityVenue"
				placeholder="Search Venue"
			/>
		</div>

		<div className="col s6 col-xs-6">
			<ResultList
				sensorId="SearchResult"
				appbaseField={group.group_topics.topic_name_raw}
				title="Meetups"
				sortBy="asc"
				from={0}
				size={20}
				onData={this.onData}
				depends={{
					VenueSensor: {"operation": "must"}
				}}
			/>
		</div>
	</div>
</ReactiveBase>
```

```js
// all the result updates are shown here
this.onData = function(res) {
	console.log(res);
}
```
