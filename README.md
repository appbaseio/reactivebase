[![Code Quality](https://www.bithound.io/github/appbaseio/reactivebase/badges/score.svg)](https://www.bithound.io/github/appbaseio/reactivebase) ![Tests Badge](https://img.shields.io/badge/tests%20passing-51%2F51-brightgreen.svg)

# Data components for building reactive UIs

{% raw %}

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
} from "@appbaseio/reactivebase";
```

```js
<ReactiveBase
	app="reactivemap_demo"
	username="y4pVxY2Ok"
	password="c92481e2-c07f-4473-8326-082919282c18"
	type="car"
	theme="rbc-dark">

	<div className="row">
		<div className="col s6 col-xs-6">
			<DataSearch
				appbaseField="venue_name_ngrams"
				componentId="VenueSensor"
				placeholder="Search Venue"
			/>
		</div>

		<div className="col s6 col-xs-6">
			<ResultList
				componentId="SearchResult"
				appbaseField="group.group_topics.topic_name_raw"
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

{% endraw %}
