import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import MainLayout from "coral-admin/components/MainLayout";
import { QueryRenderer } from "coral-framework/lib/relay";

import { StoriesQuery as QueryTypes } from "coral-admin/__generated__/StoriesQuery.graphql";
import { StoriesRouteQueryResponse } from "coral-admin/__generated__/StoriesRouteQuery.graphql";

import StoryTableContainer from "./StoryTableContainer";

import styles from "./Stories.css";

interface Props {
  query: StoriesRouteQueryResponse;
  initialSearchFilter?: string;
}

const Stories: FunctionComponent<Props> = ({ query, initialSearchFilter }) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query StoriesQuery($searchFilter: String, $siteIDs: [ID!]) {
          ...StoryTableContainer_query
            @arguments(searchFilter: $searchFilter, siteIDs: $siteIDs)
        }
      `}
      variables={{
        searchFilter: initialSearchFilter,
        siteIDs: query.viewer?.moderationScopes?.sites?.map(
          (site: { id: string }) => site.id
        ),
      }}
      cacheConfig={{ force: true }}
      render={({ error, props }) => {
        return (
          <MainLayout className={styles.root} data-testid="stories-container">
            <StoryTableContainer
              query={props}
              initialSearchFilter={initialSearchFilter}
            />
          </MainLayout>
        );
      }}
    />
  );
};

export default Stories;
