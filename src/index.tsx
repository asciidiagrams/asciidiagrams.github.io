import { Sidebar } from './layout/Sidebar/Sidebar'
import { MainContent } from './layout/MainContent/MainContent'
import { RightColumn } from './layout/RightColumn/RightColumn'

import { Filters } from './components/Filters/Filters'
import { MainContentHeader } from './components/MainContentHeader/MainContentHeader'
import { Diagrams } from './components/Diagrams/Diagrams'
import { CodesForCurrent } from './components/CodesForCurrent/CodesForCurrent'

export function Main() {
  return (
    <main style={{ display: 'flex', gap: '1rem', height: '100%', 'overflow-x': 'hidden' }}>
			<Sidebar>
				<Filters />
			</Sidebar>
      <MainContent>
        <MainContentHeader />
				<Diagrams />
      </MainContent>
			<RightColumn>
				<CodesForCurrent />
			</RightColumn>
		</main>
  )
}