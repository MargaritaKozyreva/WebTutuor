<?xml version="1.0" encoding="windows-1251"?>
<!DOCTYPE xsl:stylesheet [
	<!ENTITY nbsp "&#160;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" omit-xml-declaration="yes"/>

	<xsl:param name="sort.id"/>
	<xsl:param name="sort.or"/>
	<xsl:param name="table.id"/>
	<xsl:param name="column.widths"/>
	<xsl:param name="page.start"/>
	<xsl:param name="page.size"/>
	<xsl:param name="sort.scope"/>
	<xsl:param name="page.enable"/>
	<xsl:param name="filter.enable"/>
	<xsl:param name="filter.values"/>
	<xsl:param name="filter.strings"/>
	<xsl:param name="agg.column"/>

	<xsl:key name="key.1" match="row" use="columns/column[1]"/>
	<xsl:key name="key.2" match="row" use="columns/column[2]"/>
	<xsl:key name="key.3" match="row" use="columns/column[3]"/>
	<xsl:key name="key.4" match="row" use="columns/column[4]"/>
	<xsl:key name="key.5" match="row" use="columns/column[5]"/>
	<xsl:key name="key.6" match="row" use="columns/column[6]"/>
	<xsl:key name="key.7" match="row" use="columns/column[7]"/>
	<xsl:key name="key.8" match="row" use="columns/column[8]"/>
	<xsl:key name="key.9" match="row" use="columns/column[9]"/>
	<xsl:key name="key.10" match="row" use="columns/column[10]"/>
	<xsl:key name="key.11" match="row" use="columns/column[11]"/>
	<xsl:key name="key.12" match="row" use="columns/column[12]"/>
	<xsl:key name="key.13" match="row" use="columns/column[13]"/>
	<xsl:key name="key.14" match="row" use="columns/column[14]"/>
	<xsl:key name="key.15" match="row" use="columns/column[15]"/>
	<xsl:key name="key.16" match="row" use="columns/column[16]"/>
	<xsl:key name="key.17" match="row" use="columns/column[17]"/>
	<xsl:key name="key.18" match="row" use="columns/column[18]"/>
	<xsl:key name="key.19" match="row" use="columns/column[19]"/>
	<xsl:key name="key.20" match="row" use="columns/column[20]"/>
	<xsl:key name="key.21" match="row" use="columns/column[21]"/>
	<xsl:key name="key.22" match="row" use="columns/column[22]"/>
	<xsl:key name="key.23" match="row" use="columns/column[23]"/>
	<xsl:key name="key.24" match="row" use="columns/column[24]"/>
	<xsl:key name="key.25" match="row" use="columns/column[25]"/>
	<xsl:key name="key.26" match="row" use="columns/column[26]"/>
	<xsl:key name="key.27" match="row" use="columns/column[27]"/>
	<xsl:key name="key.28" match="row" use="columns/column[28]"/>
	<xsl:key name="key.29" match="row" use="columns/column[29]"/>
	<xsl:key name="key.30" match="row" use="columns/column[30]"/>

	<xsl:variable name="sort.column">
		<xsl:if test="$sort.id!=''"><xsl:value-of select="number($sort.id)"/></xsl:if>
		<xsl:if test="$sort.id=''">1</xsl:if>
	</xsl:variable>
	<xsl:variable name="sort.order">
		<xsl:if test="$sort.or!=''">
			<xsl:choose>
				<xsl:when test="($sort.or='ascending') or ($sort.or='descending')"><xsl:value-of select="$sort.or"/></xsl:when>
				<xsl:otherwise>ascending</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="$sort.or=''">ascending</xsl:if>
	</xsl:variable>

	<!-- VARIABLES -->

	<xsl:variable name="settings.display_row_numbers">1</xsl:variable>


	<!-- TEMPLATE START -->

	<xsl:template match="/">
		<xsl:apply-templates />
	</xsl:template>






	<xsl:template match="report_result">

		<xsl:variable name="sort.type" select="header/columns/column[number($sort.column)]/sort"/>

		<table cellpadding="0" cellspacing="0" border="0">
			<xsl:attribute name="grid">1</xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="$table.id"/></xsl:attribute>

			<xsl:for-each select="header">
				<xsl:call-template name="head">
					<xsl:with-param name="head.number" select="position()"/>
					<xsl:with-param name="head.total" select="last()"/>
				</xsl:call-template>
			</xsl:for-each>


			<xsl:choose>
				<xsl:when test="$agg.column!='0'">
					<xsl:variable name="current.key">key.<xsl:value-of select="$agg.column"/></xsl:variable>
					<xsl:variable name="current.sort" select="header/columns/column[$agg.column]/sort/text()"/>
					<xsl:for-each select="rows/row[count(. | key($current.key, columns/column[$agg.column])[1]) = 1]">
					<!--<xsl:for-each select="key($current.key, rows/row/columns/column[$agg.column])">-->
						<xsl:sort select="columns/column[$agg.column]" data-type="{$current.sort}" order="ascending"/>

						<xsl:call-template name="grouping">
							<xsl:with-param name="cur.key" select="$current.key"/>
						</xsl:call-template>

						<xsl:for-each select="key($current.key, columns/column[$agg.column])">
							<xsl:sort select="normalize-space(columns/column[number($sort.column)]/column_value/text())" data-type="{$sort.type}" order="{$sort.order}"/>

							<xsl:call-template name="row">
								<xsl:with-param name="row.number" select="position()"/>
								<xsl:with-param name="row.total" select="last()"/>
							</xsl:call-template>

						</xsl:for-each>
					</xsl:for-each>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="$sort.type='date'">

							<xsl:for-each select="rows/row">
								<xsl:sort select="number(concat(substring-after(substring-after(columns/column[number($sort.column)]/column_value/text(),'.'),'.') , substring-before(substring-after(columns/column[number($sort.column)]/column_value/text(),'.'),'.') , substring-before(columns/column[number($sort.column)]/column_value/text(),'.')))" data-type="number" order="{$sort.order}"/>
								<!--<xsl:sort select="columns/column[$sort.column]/sort_value/text()" data-type="number" order="{$sort.order}"/>-->
								<xsl:call-template name="row">
									<xsl:with-param name="row.number" select="position()"/>
									<xsl:with-param name="row.total" select="last()"/>
								</xsl:call-template>
							</xsl:for-each>

						</xsl:when>
						<xsl:otherwise>

							<xsl:for-each select="rows/row">
								<xsl:sort select="columns/column[$sort.column]/column_value/text()" data-type="{$sort.type}" order="{$sort.order}"/>
								<xsl:call-template name="row">
									<xsl:with-param name="row.number" select="position()"/>
									<xsl:with-param name="row.total" select="last()"/>
								</xsl:call-template>
							</xsl:for-each>

						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>

		</table>
	</xsl:template>



	<xsl:template match="row" name="grouping">

		<xsl:param name="cur.key"/>

		<tr group="1">
			<xsl:if test="$settings.display_row_numbers='1'">
				<td align="right" valign="top" class="wsgr_row_number_clickable" onclick="WSGR_ToggleAggregation(this); return false;">-</td>
			</xsl:if>
			<xsl:for-each select="columns/column">
				<td>
					<xsl:variable name="current.cell" select="position()"/>
					<xsl:variable name="current.grouping" select="../../../../header/columns/column[$current.cell]/group/text()"/>
					<xsl:attribute name="class">
						<xsl:choose>
							<xsl:when test="position()=1">wsgr_row_group_left<xsl:if test="$current.cell=$agg.column"> current_group</xsl:if></xsl:when>
							<xsl:when test="position()=last()">wsgr_row_group_right<xsl:if test="$current.cell=$agg.column"> current_group</xsl:if></xsl:when>
							<xsl:otherwise>wsgr_row_group_regular<xsl:if test="$current.cell=$agg.column"> current_group</xsl:if></xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>

					<xsl:choose>
						<xsl:when test="$current.cell=$agg.column"><xsl:value-of select="column_value/text()"/></xsl:when>
						<xsl:when test="$current.grouping='list'">-</xsl:when>
						<xsl:when test="$current.grouping='count'"><nobr>CNT: <xsl:value-of select="count(key($cur.key, ../../columns/column[$agg.column]))"/></nobr></xsl:when>
						<xsl:when test="$current.grouping='sum'"><nobr>SUM: <xsl:value-of select="sum(key($cur.key, ../../columns/column[$agg.column])/columns/column[$current.cell]/column_value/text())"/></nobr></xsl:when>
						<xsl:when test="$current.grouping='avg'"><nobr>AVG: <xsl:value-of select="format-number(sum(key($cur.key, ../../columns/column[$agg.column])/columns/column[$current.cell]/column_value/text()) div count(key($cur.key, ../../columns/column[$agg.column])), '0.00')"/></nobr></xsl:when>
						<xsl:otherwise>&nbsp;</xsl:otherwise>
					</xsl:choose>
				</td>
			</xsl:for-each>
		</tr>

	</xsl:template>



	<xsl:template name="head" match="head">

		<xsl:param name="head.number"/>
		<xsl:param name="head.total"/>

		<tr>
			<xsl:attribute name="header">1</xsl:attribute>
			<xsl:attribute name="id">wsgr_head_<xsl:value-of select="$head.number"/></xsl:attribute>
			<xsl:if test="$settings.display_row_numbers='1'">
				<td resize="0" column="0" align="right" class="wsgr_row_number_header">#</td>
			</xsl:if>
			<xsl:for-each select="columns/column">
				<xsl:variable name="current.column.number" select="position()"/>
				<xsl:variable name="current.column.separator" select="concat(string($current.column.number),'~')"/>
				<xsl:variable name="current.column.savedwidth" select="substring-before(substring-after($column.widths, $current.column.separator),'+')"/>
				<xsl:variable name="current.column.width">
					<xsl:if test="$column.widths=''"></xsl:if>
					<xsl:if test="$column.widths!=''"><xsl:value-of select="$current.column.savedwidth"/></xsl:if>
				</xsl:variable>
				<xsl:call-template name="headercolumn">
					<xsl:with-param name="column.number" select="$current.column.number"/>
					<xsl:with-param name="column.total" select="last()"/>
					<xsl:with-param name="column.width" select="$current.column.width"/>
				</xsl:call-template>
			</xsl:for-each>
		</tr>
	</xsl:template>







	<xsl:template name="headercolumn" match="column">

		<xsl:param name="column.number"/>
		<xsl:param name="column.total"/>
		<xsl:param name="column.width"/>

		<td>
			<xsl:attribute name="column"><xsl:value-of select="$column.number"/></xsl:attribute>
			<xsl:attribute name="width"><xsl:value-of select="$column.width"/></xsl:attribute>
			<xsl:attribute name="resize">1</xsl:attribute>
			<xsl:attribute name="class">
				<xsl:choose>
					<xsl:when test="$column.number='1'">wsgr_head_left</xsl:when>
					<xsl:when test="$column.number=$column.total">wsgr_head_right</xsl:when>
					<xsl:otherwise>wsgr_head_regular</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>

			<table cellpadding="0" cellspacing="0" border="0">
				<xsl:attribute name="class">wsgr_header_table</xsl:attribute>
				<tr>
					<td>
						<xsl:attribute name="title">Click to change sorting</xsl:attribute>
						<xsl:attribute name="class">wsgr_sort_none</xsl:attribute>
						<img src="images/1blank.gif" border="0">
							<xsl:attribute name="class">wsgr_sort_tangle</xsl:attribute>
						</img>
					</td>

					<td class="wsgr_header_text">
						<xsl:attribute name="title">Click to change sorting</xsl:attribute>
						<xsl:attribute name="column"><xsl:value-of select="$column.number"/></xsl:attribute>
						<xsl:if test="nowrap/text()='1'"><xsl:attribute name="nowrap">nowrap</xsl:attribute></xsl:if>
						<xsl:attribute name="sorted">
							<xsl:choose>
								<xsl:when test="$column.number=$sort.column"><xsl:value-of select="$sort.order"/></xsl:when>
								<xsl:otherwise>none</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:attribute name="style">text-align: <xsl:value-of select="@align"/>;</xsl:attribute>
						<xsl:value-of select="column_value"/>
					</td>

					<td>
						<xsl:attribute name="resizespot">1</xsl:attribute>
						<xsl:attribute name="title">
							<xsl:if test="resize/text()!='1'">This column cannot be resized</xsl:if>
							<xsl:if test="resize/text()='1'">Drag to resize this column</xsl:if>
						</xsl:attribute>
						<xsl:attribute name="class">
							<xsl:if test="resize/text()='1'">wsgr_resize</xsl:if>
							<xsl:if test="resize/text()!='1'">wsgr_resize_none</xsl:if>
						</xsl:attribute>
						<img src="images/1blank.gif" border="0">
							<xsl:attribute name="class">wsgr_resize_tangle</xsl:attribute>
						</img>
					</td>

				</tr>
			</table>

		</td>

	</xsl:template>









	<xsl:template name="row" match="row">

<!--		<xsl:param name="row.odd"/>-->
		<xsl:param name="row.number"/>
		<xsl:param name="row.total"/>
		<tr>
			<xsl:attribute name="row_id"><xsl:value-of select="id"/></xsl:attribute>

			<xsl:if test="$settings.display_row_numbers='1'">
				<td align="right" valign="top" class="wsgr_row_number"><xsl:value-of select="$row.number"/></td>
			</xsl:if>

			<xsl:for-each select="columns/column">
				<xsl:call-template name="cell">
					<xsl:with-param name="cell.number" select="position()"/>
					<xsl:with-param name="cell.total" select="last()"/>
				</xsl:call-template>
			</xsl:for-each>

		</tr>

	</xsl:template>





	<xsl:template name="cell" match="column">
		<!--<xsl:param name="row.id"/>
		<xsl:param name="row.odd"/>
		<xsl:param name="row.number"/>
		<xsl:param name="row.total"/>-->
		<xsl:param name="cell.number"/>
		<xsl:param name="cell.total"/>
		<!--<xsl:param name="cell.width"/>-->
		<td>
			<xsl:attribute name="class">
					<xsl:choose>
						<xsl:when test="$cell.number='1'">wsgr_odd_cell_left</xsl:when>
						<xsl:when test="$cell.number=$cell.total">wsgr_odd_cell_right</xsl:when>
						<xsl:otherwise>wsgr_odd_cell_regular</xsl:otherwise>
					</xsl:choose>
			</xsl:attribute>

			<xsl:choose>
				<xsl:when test="boolean(column_value)=false()"></xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="column_value/text()=''"></xsl:when>
						<xsl:otherwise><xsl:value-of select="column_value/text()" disable-output-escaping="yes"/></xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:text disable-output-escaping="yes">&nbsp;</xsl:text>
		</td>
	</xsl:template>




</xsl:stylesheet>
